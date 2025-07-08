# auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from models import User, Role, db
from werkzeug.security import generate_password_hash
from flask_cors import cross_origin
from functools import wraps

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
@cross_origin()
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role_names = data.get('roles', ['user'])

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 400

    user = User(email=email, name=name)
    user.set_password(password)

    roles = Role.query.filter(Role.name.in_(role_names)).all()
    user.roles.extend(roles)

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully!"}), 201

@auth_bp.route('/login', methods=['POST'])
@cross_origin()
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        roles = [role.name for role in user.roles]
        access_token = create_access_token(
            identity=user.id,
            additional_claims={"roles": roles}
        )
        return jsonify({
            "access_token": access_token,
            "user_id": user.id,
            "username": user.name,
            "roles": roles
        }), 200

    return jsonify({"msg": "Invalid email or password"}), 401


def role_required(required_role):
    """Decorator to restrict access based on user role."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            roles = claims.get("roles", [])
            if required_role not in roles:
                return jsonify({"msg": "Access forbidden: Insufficient permissions"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
