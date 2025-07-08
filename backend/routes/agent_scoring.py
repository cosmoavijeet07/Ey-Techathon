from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import google.generativeai as genai
import time
import json
# Initialize blueprint
agent_scoring_bp = Blueprint("agent_scoring", __name__)

# Configure Gemini AI
genai.configure(api_key="AIzaSyBajGa89W5CJOGwLfYQUkSqw6B505KGRiA")

# Track timestamps for response time
response_times = {}

def analyze_message_quality(message):
    """Uses Gemini AI to evaluate sentiment, clarity, and effectiveness."""
    prompt = f"""
    Analyze the following agent response:
    - Determine its sentiment (positive, neutral, or negative).
    - Assess the level of empathy (low, medium, high).
    - Evaluate clarity on a scale of 1-10.
    - Determine if it effectively resolves a customer issue (Yes/No).

    Response: "{message}"

    Return output in this JSON format:
    {{"sentiment": "positive/neutral/negative", "empathy": "low/medium/high", "clarity": 1-10, "resolution": "Yes/No"}}
    """

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    return response.text.strip()

def calculate_score(response_time, sentiment, empathy, clarity, resolution):
    """Computes agent performance score based on multiple factors."""
    score = 100

    # Response Time Scoring
    if response_time > 10:
        score -= 20
    elif response_time > 5:
        score -= 10

    # Sentiment Impact
    if sentiment == "negative":
        score -= 15
    elif sentiment == "neutral":
        score -= 5

    # Empathy Level
    if empathy == "low":
        score -= 20
    elif empathy == "medium":
        score -= 10

    # Clarity
    score += clarity

    # Problem Resolution
    if resolution == "No":
        score -= 25

    return max(0, min(100, score))  # Keep score within 0-100

@agent_scoring_bp.route("/scoring", methods=["POST"])

def agent_scoring():
    """Evaluates agent response and returns performance score."""
    try:
        data = request.json
        agent_message = data.get("message")
        agent_id = data.get("agent_id")  # Identify agent

        if not agent_message or not isinstance(agent_message, str):
            return jsonify({"error": "Message must be a non-empty string"}), 400

        # Calculate response time
        current_time = time.time()
        previous_time = response_times.get(agent_id, current_time)
        response_time = current_time - previous_time
        response_times[agent_id] = current_time

        # Analyze quality
        analysis = analyze_message_quality(agent_message)
        analysis_data = json.loads(analysis)

       
        # Compute final score
        score = calculate_score(
            response_time,
            analysis_data["sentiment"],
            analysis_data["empathy"],
            analysis_data["clarity"],
            analysis_data["resolution"]
        )

        return jsonify({
            "response_time": round(response_time, 2),
            "analysis": analysis_data,
            "score": score
        })

    except Exception as e:
        return jsonify({"error": "Failed to process request", "details": str(e)}), 500
