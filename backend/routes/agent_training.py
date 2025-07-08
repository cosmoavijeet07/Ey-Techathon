from flask import Blueprint, request, jsonify
import google.generativeai as genai
from datetime import datetime

# Initialize Blueprint
agent_training_bp = Blueprint("agent_training", __name__)

# Configure Gemini AI (Replace with your actual API key)
genai.configure(api_key="AIzaSyBajGa89W5CJOGwLfYQUkSqw6B505KGRiA")

# Predefined customer types and issue types
CUSTOMER_TYPES = {
    "angry": {
        "initial": "You are an extremely frustrated customer. Express your anger about a poor experience and demand a resolution.",
        "adaptive": "If the agent is polite and helpful, slowly become calmer and cooperative. If they fail, escalate frustration."
    },
    "disappointed": {
        "initial": "You are a disappointed customer. Politely express dissatisfaction and hope for a better resolution.",
        "adaptive": "If the agent offers a good solution, gradually become satisfied. Otherwise, shift towards anger or frustration."
    },
    "happy": {
        "initial": "You are a satisfied customer. Express gratitude and appreciation for the service received.",
        "adaptive": "If the agent is unhelpful, start doubting their service but remain polite. If they are kind, continue being happy."
    },
    "confused": {
        "initial": "You are a confused customer struggling to communicate your issue clearly. Seek assistance from the agent.",
        "adaptive": "If the agent clarifies well, you become more confident. If they confuse you further, you become frustrated."
    }
}

ISSUE_TYPES = {
    "claim_rejected": "The customer's claim has been denied despite submitting documents. They seek clarification or reconsideration.",
    "claim_delayed": "The claim is still under review beyond the expected processing time, leading to frustration over the delay.",
    "missing_documents": "The claim cannot proceed due to missing documents. The customer needs guidance on what is required.",
    "successful_claim": "The claim has been approved and processed, but the customer may have concerns about payout, deductions, or delays in receiving funds.",
    "claim_partially_approved": "The claim was only partially approved, and the customer wants to understand why the full amount was not granted.",
    "claim_escalation": "The customer is unhappy with the resolution and requests the claim to be escalated for further review.",
    "incorrect_payout": "The customer received a payout but believes the amount is incorrect or lower than expected.",
    "claim_cancellation": "The claim was canceled either by the customer or the insurer, and they need assistance with the process or reversal.",
    "policy_coverage_issue": "The claim was rejected due to policy terms not covering the situation, leading to confusion or dispute over coverage details.",
    "technical_error": "A system-related issue caused a delay or incorrect claim processing, requiring technical support or resolution."
}

# Learner progress tracking
agent_progress = {}

def rate_agent_response(agent_message, customer_reply):
    """AI rates agent response based on clarity, empathy, and problem-solving."""
    prompt = f"""
    Rate the agent's response from 1 to 100 based on:
    - Clarity (Is the response well-structured?)
    - Empathy (Does the agent show care?)
    - Problem-solving (Does it address the issue?)

    Agent's Response: {agent_message}
    Customer's Reply: {customer_reply}
    
    Provide a score and detailed feedback in 40 to 50 words .
    """
    
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    if response and hasattr(response, "text"):
        feedback = response.text.strip()
        return feedback
    return "No rating available."

@agent_training_bp.route("/simulate", methods=["POST"])
def simulate_conversation():
    """Handles AI-powered customer simulation using Gemini AI."""
    try:
        data = request.get_json()

        # Validate request data
        customer_type = data.get("customer_type")
        issue_type = data.get("issue_type")
        agent_message = data.get("message")
        history = data.get("history")

        if customer_type not in CUSTOMER_TYPES or issue_type not in ISSUE_TYPES:
            return jsonify({"error": "Invalid customer type or issue type"}), 400

        if not agent_message or not agent_message.strip():
            return jsonify({"error": "Message must be a non-empty string"}), 400

        # Build conversation history
        conversation_history = "\n".join(
            [f"{msg.get('sender')}: {msg.get('text')}" for msg in history if isinstance(msg, dict)]
        )

        # AI prompt with adaptive behavior and issue context
        prompt = f"""
        Roleplay as a customer. {CUSTOMER_TYPES[customer_type]['initial']}
        Adapt your tone based on how the agent responds: {CUSTOMER_TYPES[customer_type]['adaptive']}
        Issue Context: {ISSUE_TYPES[issue_type]}
        
        {conversation_history}
        Agent: {agent_message}
        Customer:
        """

        # Generate AI response
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        if response and hasattr(response, "text"):
            customer_reply = response.text.strip()
            agent_rating = rate_agent_response(agent_message, customer_reply)
            return jsonify({"response": customer_reply, "rating": agent_rating})
        else:
            return jsonify({"error": "AI did not return a response"}), 500

    except Exception as e:
        return jsonify({"error": "Failed to generate response", "details": str(e)}), 500

@agent_training_bp.route("/progress", methods=["POST"])
def update_progress():
    """Updates agent progress and milestones."""
    data = request.get_json()
    agent_id = data.get("agent_id")
    score = data.get("score")

    if not agent_id or not score:
        return jsonify({"error": "Agent ID and score are required"}), 400

    if agent_id not in agent_progress:
        agent_progress[agent_id] = {"total_score": 0, "sessions": 0, "milestones": []}

    agent_progress[agent_id]["total_score"] += score
    agent_progress[agent_id]["sessions"] += 1

    # Check for milestones
    milestones = [100, 300, 500, 1000]
    for milestone in milestones:
        if agent_progress[agent_id]["total_score"] >= milestone and milestone not in agent_progress[agent_id]["milestones"]:
            agent_progress[agent_id]["milestones"].append(milestone)
            return jsonify({
                "message": f"Congratulations! You reached a milestone of {milestone} points.",
                "milestones": agent_progress[agent_id]["milestones"]
            })

    return jsonify({"message": "Progress updated", "total_score": agent_progress[agent_id]["total_score"]})