from flask import Blueprint, jsonify, current_app
from db import db
from models import CallQueue
from datetime import datetime, timedelta

escalation_bp = Blueprint("escalation", __name__)

# Function to check for automatic escalation (Fix: Pass `app` explicitly)
def auto_escalate_calls(app):
    with app.app_context():  # Use app instead of current_app
        try:
            now = datetime.utcnow()
            calls = CallQueue.query.filter(CallQueue.status != "resolved").all()

            for call in calls:
                time_since_update = now - call.last_updated

                # Escalation Logic
                if call.escalation_level == 0 and call.status == "in-progress" and time_since_update > timedelta(hours=4):
                    call.escalation_level = 1  # Move to Tier 1
                    call.status = "escalated"
                elif call.escalation_level == 1 and time_since_update > timedelta(hours=4):
                    call.escalation_level = 2  # Move to Tier 2
                elif call.escalation_level == 2 and time_since_update > timedelta(hours=6):
                    call.escalation_level = 3  # Final escalation (Admin intervention)

            db.session.commit()
            print("✅ Auto-escalation completed successfully.")

        except Exception as e:
            db.session.rollback()
            print("❌ Error during auto-escalation:", e)


# API to trigger escalation check manually
@escalation_bp.route("/run-escalation-check", methods=["POST"])
def run_escalation():
    auto_escalate_calls()
    return jsonify({"message": "Escalation check completed successfully"}), 200
