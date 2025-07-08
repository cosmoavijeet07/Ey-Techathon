from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from db import db  # Assuming 'db' is initialized in the app context

# Model for form submission
class FormSubmission(db.Model):
    __tablename__ = "form_submission"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), nullable=False)  # Updated field to match frontend

# Model for call queue
class CallQueue(db.Model):
    __tablename__ = 'call_queue'  # Ensure table name is defined

    id = db.Column(db.Integer, primary_key=True)
    caller_name = db.Column(db.String(100), nullable=False)
    caller_phone = db.Column(db.String(20), nullable=False)
    issue_type = db.Column(db.String(100), nullable=False)
    issue_description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default="pending")
    assigned_agent = db.Column(db.String(100), nullable=True)
    priority = db.Column(db.String(10), default="Medium")
    sentiment_score = db.Column(db.Float, default=0.0)
    escalation_level = db.Column(db.Integer, default=0)  # New column for multi-tier escalation
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "caller_name": self.caller_name,
            "caller_phone": self.caller_phone,
            "issue_type": self.issue_type,
            "issue_description": self.issue_description,
            "status": self.status,
            "priority": self.priority,
            "sentiment_score": self.sentiment_score,
            "escalation_level": self.escalation_level,
            "created_at": self.created_at.isoformat(),
            "last_updated": self.last_updated.isoformat(),
        }

# Association table for the many-to-many relationship between Users and Roles
user_roles = db.Table('user_roles',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('role_id', db.Integer, db.ForeignKey('role.id'), primary_key=True)
)

# User model
class User(db.Model):
    __tablename__ = 'user'  # Ensure table name is defined

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    name=db.Column(db.String(150))
    password_hash = db.Column(db.String(128), nullable=False)
    roles = db.relationship('Role', secondary=user_roles, backref=db.backref('users', lazy=True))
    feedbacks = db.relationship('Feedback', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Role model
class Role(db.Model):
    __tablename__ = 'role'  # Ensure table name is defined

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)


class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    feedback_text = db.Column(db.Text, nullable=False)
    translated_text = db.Column(db.Text, nullable=False)
    sentiment_score = db.Column(db.Float, nullable=False)
    language = db.Column(db.String(15), nullable=False)  # New column to store language
    client_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)  # Track sentiment history
    client_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
class ChurnPrediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    churn_probability = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)