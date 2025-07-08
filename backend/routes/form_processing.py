from flask import Blueprint, request, jsonify
from db import db
from models import FormSubmission

form_processing_bp = Blueprint("form_processing", __name__)

# Route to handle form submission
@form_processing_bp.route("", methods=["POST"])
def submit_form():
    """
    Processes and validates a submitted form.
    """
    data = request.get_json()

    if not data or not all(k in data for k in ("name", "email", "phone")):
        return jsonify({"error": "Invalid form data"}), 400

    new_submission = FormSubmission(name=data["name"], email=data["email"], phone=data["phone"])
    db.session.add(new_submission)
    db.session.commit()

    return jsonify({"message": "Form submitted successfully"}), 201
