from flask import Blueprint, request, jsonify
from db import db
from models import CallQueue
from datetime import datetime, timedelta
from textblob import TextBlob

priority_bp = Blueprint("priority_management", __name__)

# Function to analyze sentiment score
def analyze_sentiment(text):
    analysis = TextBlob(text)
    return analysis.sentiment.polarity  # Returns a score between -1 (negative) and +1 (positive)

# Function to determine priority based on issue type and sentiment
def assign_priority(issue_type, call_time, sentiment_score):
    priority_mapping = {
        "High": ["Fraud", "Urgent Claim", "Technical Issue"],
        "Medium": ["Claim Status Update", "Payment Issue"],
        "Low": ["General Inquiry", "Policy Update"]
    }

    for priority, issues in priority_mapping.items():
        if issue_type in issues:
            assigned_priority = priority
            break
    else:
        assigned_priority = "Medium"  # Default priority

    # Escalate priority for very old pending calls
    if datetime.utcnow() - call_time > timedelta(hours=6):
        assigned_priority = "High"

    # Adjust priority based on sentiment
    if sentiment_score < -0.5:
        assigned_priority = "High"
    elif sentiment_score < 0:
        assigned_priority = "Medium"

    return assigned_priority

# Endpoint to update priority for all calls based on issue type & sentiment
@priority_bp.route("/update-priorities", methods=["POST"])
def update_priorities():
    calls = CallQueue.query.filter_by(status="pending").all()
    
    for call in calls:
        sentiment_score = analyze_sentiment(call.issue_description)
        call.priority = assign_priority(call.issue_type, call.created_at, sentiment_score)
        call.sentiment_score = sentiment_score  # Save sentiment score

    db.session.commit()
    return jsonify({"message": "Priorities updated successfully"}), 200

# Endpoint to get prioritized call queue
@priority_bp.route("/get-priority-queue", methods=["GET"])
def get_priority_queue():
    calls = CallQueue.query.filter(CallQueue.status == "pending").order_by(
        db.case(
            (CallQueue.priority == "High", 1),
            (CallQueue.priority == "Medium", 2),
            (CallQueue.priority == "Low", 3),
            else_=4
        )
    ).all()
    
    return jsonify([call.to_dict() for call in calls]), 200
