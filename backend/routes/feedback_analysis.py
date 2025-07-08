from flask import Blueprint, jsonify
from models import Feedback
from transformers import pipeline

feedback_analysis_bp = Blueprint('feedback_analysis', __name__)

# Load NLP models
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

CATEGORIES = ["Agent Rudeness", "Long Wait Time", "Issue Unresolved", "Great Service"]

def group_feedback(feedback_list):
    grouped_feedback = {category: [] for category in CATEGORIES}

    for feedback in feedback_list:
        result = classifier(feedback, CATEGORIES)
        best_category = result['labels'][0]
        grouped_feedback[best_category].append(feedback)
    
    return grouped_feedback

def generate_advice(grouped_feedback):
    advice = {}
    for category, feedbacks in grouped_feedback.items():
        if feedbacks:
            combined_text = " ".join(feedbacks)
            input_length = len(combined_text.split())  
            max_length = max(20, int(input_length * 0.5))  
            summary = summarizer(combined_text, max_length=max_length, min_length=10, do_sample=False)[0]['summary_text']
            advice[category] = summary
    return advice

@feedback_analysis_bp.route('/analyze-feedback', methods=['GET'])
def analyze_feedback():
    feedback_entries = Feedback.query.all()
    feedback_texts = [entry.feedback_text for entry in feedback_entries]
    
    grouped_feedback = group_feedback(feedback_texts)
    frequency_counts = {category: len(feedbacks) for category, feedbacks in grouped_feedback.items()}
    advice = generate_advice(grouped_feedback)
    
    return jsonify({
        "grouped_feedback_counts": frequency_counts,
        "advice": advice
    })
