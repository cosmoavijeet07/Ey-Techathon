from flask import Blueprint, jsonify
from db import db
from models import CallQueue

call_management_bp = Blueprint("call_management", __name__)

@call_management_bp.route("/call-stats", methods=["GET"])
def get_call_statistics():
    """
    Fetches call statistics including pending, in-progress, resolved, and escalated calls.
    """
    stats = {
        "pending": CallQueue.query.filter_by(status="pending").count(),
        "inProgress": CallQueue.query.filter_by(status="in-progress").count(),
        "resolved": CallQueue.query.filter_by(status="resolved").count(),
        "escalated": CallQueue.query.filter_by(status="escalated").count(),
    }
    
    return jsonify(stats), 200