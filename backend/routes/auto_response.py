import os
import google.generativeai as genai
from flask import Blueprint, request, jsonify

# Define Blueprint
auto_response_bp = Blueprint('auto_response', __name__)

# Set up Gemini API key
GEMINI_API_KEY = "AIzaSyBajGa89W5CJOGwLfYQUkSqw6B505KGRiA"
genai.configure(api_key=GEMINI_API_KEY)

# Load the generative model
model = genai.GenerativeModel("gemini-1.5-flash")

@auto_response_bp.route('/generate-response', methods=['POST'])
def generate_response():
    data = request.json
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"message": "Message cannot be empty.", "generated_response": ""}), 400

    try:
        # Construct prompt
        prompt = f"Generate a professional and polite response to complete the message:\n\n{user_message}\n\nResponse:"
        
        # Generate response
        response = model.generate_content(prompt)
        generated_text = response.text.strip() if response and response.text else "Error generating response."

        return jsonify({
            "message": "Response generated successfully.",
            "generated_response": generated_text
        })

    except Exception as e:
        return jsonify({"message": "Error generating response.", "error": str(e)}), 500

