import subprocess
from flask import Blueprint, jsonify

streamlit_bp = Blueprint("streamlit", __name__)

@streamlit_bp.route("/deploy-streamlit", methods=["POST"])
def deploy_streamlit():
    try:
        subprocess.Popen(["streamlit", "run", "app.py"])  # Adjust based on deployment setup
        return jsonify({"message": "Streamlit deployment started"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
