from flask import Blueprint, jsonify
from auth import role_required

admin_bp = Blueprint('admin', __name__)
manager_bp = Blueprint('manager', __name__)
agent_bp = Blueprint('agent', __name__)

@admin_bp.route('/admin/dashboard', methods=['GET'])
@role_required(['admin'])
def admin_dashboard():
    return jsonify({"msg": "Welcome to the admin dashboard"}), 200

@manager_bp.route('/manager/dashboard', methods=['GET'])
@role_required(['manager'])
def manager_dashboard():
    return jsonify({"msg": "Welcome to the manager dashboard"}), 200

@agent_bp.route('/agent/dashboard', methods=['GET'])
@role_required(['agent'])
def agent_dashboard():
    return jsonify({"msg": "Welcome to the agent dashboard"}), 200
