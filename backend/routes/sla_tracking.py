from flask import Blueprint, request, jsonify
from db import db
from models import CallQueue
from datetime import datetime, timedelta

sla_bp = Blueprint("sla_tracking", __name__)

# Define SLA time limits based on priority
SLA_TIME_LIMITS = {
    "High": 2,  # 2 hours
    "Medium": 6,  # 6 hours
    "Low": 12  # 12 hours
}

# Endpoint to check SLA status
@sla_bp.route("/check-sla", methods=["GET"])
def check_sla():
    current_time = datetime.utcnow()
    calls = CallQueue.query.filter(CallQueue.status == "pending").all()
    
    alerts = []
    for call in calls:
        sla_time_limit = SLA_TIME_LIMITS.get(call.priority, 12)
        deadline = call.created_at + timedelta(hours=sla_time_limit)
        
        if current_time > deadline:
            alerts.append({
                "call_id": call.id,
                "caller_name": call.caller_name,
                "priority": call.priority,
                "status": "SLA Breached"
            })
    
    return jsonify({"sla_alerts": alerts}), 200

# Endpoint to get all calls sorted by SLA urgency
@sla_bp.route("/sla-queue", methods=["GET"])
def sla_queue():
    current_time = datetime.utcnow()
    calls = CallQueue.query.filter(CallQueue.status == "pending").all()

    # Sort by time remaining before SLA breach
    sorted_calls = sorted(calls, key=lambda call: (call.created_at + timedelta(hours=SLA_TIME_LIMITS.get(call.priority, 12))) - current_time)

    return jsonify([call.to_dict() for call in sorted_calls]), 200
