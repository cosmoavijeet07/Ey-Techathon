from flask import Blueprint, request, jsonify
import google.generativeai as genai
import os

email_bp = Blueprint("email", __name__)

# Configure Gemini AI
GOOGLE_API_KEY = "AIzaSyBajGa89W5CJOGwLfYQUkSqw6B505KGRiA"  # Replace with your actual API key
genai.configure(api_key=GOOGLE_API_KEY)

def generate_email_response(email_text):
    """
    Generates an AI-based professional email response.
    """
    prompt = f"""
    You are an advanced AI email assistant. You generate highly professional and structured email replies.
    Given the following customer email, craft a well-structured response that includes:
    - A polite greeting
    - Addressing the customer's concern
    - Providing a clear, informative, and helpful response
    - Closing with a professional sign-off

    Customer Email:
    {email_text}

    AI-Generated Response:
    """
    
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    return response.text.strip() if response.text else "Error generating response."

# Route to handle email processing
@email_bp.route("/generate-email-reply", methods=["POST"])
def generate_reply():
    data = request.json
    customer_email = data.get("email")

    if not customer_email:
        return jsonify({"error": "No email content provided"}), 400

    try:
        ai_response = generate_email_response(customer_email)
        return jsonify({"response": ai_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
