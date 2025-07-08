from flask import Blueprint, jsonify, request
from textblob import TextBlob
from datetime import datetime
from db import db
from models import Feedback, User

sentiment_bp = Blueprint('sentiment', __name__)

def get_sentiment_score(feedback_text):
    analysis = TextBlob(feedback_text)
    return analysis.sentiment.polarity

@sentiment_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{"id": user.id, "name": user.name} for user in users])

@sentiment_bp.route('/sentiment-history/<string:client_name>', methods=['GET'])
def get_sentiment_history(client_name):
    client = User.query.filter_by(name=client_name).first()
    if not client:
        return jsonify({"message": "Client not found"}), 404

    feedbacks = Feedback.query.filter_by(client_id=client.id).order_by(Feedback.timestamp).all()
    sentiment_history = [{
        "timestamp": feedback.timestamp,
        "sentiment_score": feedback.sentiment_score,
        "feedback_text": feedback.feedback_text
    } for feedback in feedbacks]

    return jsonify(sentiment_history)

@sentiment_bp.route('/sentiment-history/all', methods=['GET'])
def get_aggregate_sentiment_history():
    feedbacks = Feedback.query.order_by(Feedback.timestamp).all()
    sentiment_history = [{
        "timestamp": feedback.timestamp,
        "sentiment_score": feedback.sentiment_score,
        "feedback_text": feedback.feedback_text
    } for feedback in feedbacks]

    return jsonify(sentiment_history)
