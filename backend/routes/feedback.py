from flask import Blueprint, request, jsonify
from models import db, User, Feedback
from textblob import TextBlob
from googletrans import Translator

feedback_bp = Blueprint('feedback', __name__)
translator = Translator()

def analyze_sentiment(text):
    analysis = TextBlob(text)
    return round(analysis.sentiment.polarity, 2)  # Round sentiment score

@feedback_bp.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    client_id = data.get('client_id')
    feedback_text = data.get('feedback')
    language = data.get('language', 'en')  # Default to English if not provided

    if not client_id or not feedback_text:
        return jsonify({'message': 'Client ID and feedback are required.'}), 400

    client = User.query.get(client_id)
    if not client:
        return jsonify({'message': 'Client not found.'}), 404

    # Translate feedback to English for sentiment analysis if it's not in English
    translated_text = feedback_text
    if language != 'en':
        try:
            translated_text = translator.translate(feedback_text, src=language, dest='en').text
        except Exception as e:
            return jsonify({'message': 'Translation failed', 'error': str(e)}), 500

    sentiment_score = analyze_sentiment(translated_text)

    feedback = Feedback(
        feedback_text=feedback_text,
        translated_text=translated_text,
        sentiment_score=sentiment_score,
        language=language,
        client_id=client.id
    )
    
    db.session.add(feedback)
    db.session.commit()

    return jsonify({
        'message': 'Feedback submitted successfully.',
        'sentiment_score': sentiment_score,
        'translated_text': translated_text
    }), 201
