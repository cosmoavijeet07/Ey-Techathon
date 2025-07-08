from flask import Blueprint, request, jsonify

batch_processing_bp = Blueprint("batch_processing", __name__)

@batch_processing_bp.route("/", methods=["POST"])
def process_batch():
    """
    Receives batch data in JSON format and simulates processing.
    """
    try:
        # Get JSON data from request
        data = request.get_json()

        # Validate request format
        if not data or "items" not in data:
            return jsonify({"error": "Invalid request format"}), 400

        items = data["items"]  # Extract the list of items

        # Simulate processing - marking each item as "processed"
        processed_items = [{"id": i, "status": "processed"} for i in items]

        # Return response
        return jsonify({"message": "Batch processed successfully", "processed_items": processed_items}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
