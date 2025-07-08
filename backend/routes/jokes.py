import os
import google.generativeai as genai
from flask import Blueprint, jsonify

# Define Blueprint
jokes_bp = Blueprint('jokes', __name__)

# Set up Gemini API key
GEMINI_API_KEY = "your_google_gemini_api_key_here"
genai.configure(api_key=GEMINI_API_KEY)

# Load the generative model
model = genai.GenerativeModel("gemini-1.5-flash")

@jokes_bp.route('/get-joke', methods=['GET'])
def get_joke():
    try:
        prompt = "Give me a very motivational and cheerful quote"
        response = model.generate_content(prompt)
        joke = response.text.strip() if response and response.text else "Error generating joke."
        
        return jsonify({"joke": joke})
    except Exception as e:
        return jsonify({"error": "Failed to generate joke", "details": str(e)}), 500