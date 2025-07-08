import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

document_upload_bp = Blueprint("document_upload", __name__)

ALLOWED_EXTENSIONS = {"pdf", "docx", "png", "jpg", "jpeg"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@document_upload_bp.route("/", methods=["POST"])
def upload_file():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            upload_folder = current_app.config["UPLOAD_FOLDER"]
            os.makedirs(upload_folder, exist_ok=True)  # Ensure directory exists
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)

            return jsonify({"message": "File uploaded successfully", "file_path": f"/uploads/{filename}"}), 200
        else:
            return jsonify({"error": "Invalid file type"}), 400

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500