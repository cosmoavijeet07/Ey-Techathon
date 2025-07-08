from flask import Blueprint, request, jsonify
from db import db
from models import CallQueue

call_queue_bp = Blueprint("call_queue", __name__)

@call_queue_bp.route("/schedule", methods=["POST"])
def schedule_call():
    data = request.get_json()

    if not all(key in data for key in ["caller_name", "caller_phone", "issue_type", "issue_description", "assigned_agent"]):
        return jsonify({"error": "Missing required fields"}), 400

    new_call = CallQueue(
        caller_name=data["caller_name"],
        caller_phone=data["caller_phone"],
        issue_type=data["issue_type"],
        issue_description=data["issue_description"],  # Added description field
        assigned_agent=data["assigned_agent"],
        status="pending"
    )

    db.session.add(new_call)
    db.session.commit()
    
    return jsonify({"message": "Call scheduled successfully", "call": new_call.to_dict()}), 201

@call_queue_bp.route("/agent/<string:agent_name>", methods=["GET"])
def get_calls_for_agent(agent_name):
    assigned_calls = CallQueue.query.filter_by(assigned_agent=agent_name).all()
    return jsonify([call.to_dict() for call in assigned_calls]), 200

@call_queue_bp.route("/update", methods=["POST"])
def update_call_status():
    data = request.get_json()
    call_id = data.get("call_id")
    status = data.get("status")

    call = CallQueue.query.get(call_id)
    if not call:
        return jsonify({"error": "Call not found"}), 404

    call.status = status
    db.session.commit()

    return jsonify({"message": "Call status updated successfully", "call": call.to_dict()}), 200
