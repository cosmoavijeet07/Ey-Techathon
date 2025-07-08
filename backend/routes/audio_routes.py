from flask import Blueprint, request, jsonify
import os
from audio_analysis import transcribe_audio, analyze_sentiment, analyze_emotion

audio_bp = Blueprint('audio', __name__)
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")

# Ensure the uploads folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    print("Created upload folder at:", UPLOAD_FOLDER)
else:
    print("Upload folder exists at:", UPLOAD_FOLDER)

@audio_bp.route("/analyze-audio", methods=["POST"])
def analyze_audio_endpoint():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]
    file_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
    print("Saving uploaded file to:", file_path)
    audio_file.save(file_path)

    try:
        # Process the audio
        transcription = transcribe_audio(file_path)
        sentiment_result = analyze_sentiment(transcription)
        emotion_result = analyze_emotion(transcription)

        response = {
            "transcription": transcription,
            "sentiment": sentiment_result,
            "emotions": emotion_result
        }
        return jsonify(response)
    except Exception as e:
        print("Error during processing:", e)
        return jsonify({"error": str(e)}), 500


