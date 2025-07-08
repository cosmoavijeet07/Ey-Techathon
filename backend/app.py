from flask import Flask
from flask_cors import CORS
from db import db
from flask_jwt_extended import JWTManager

# Import Blueprints
from routes.batch_processing import batch_processing_bp
from routes.document_upload import document_upload_bp
from routes.form_processing import form_processing_bp
from routes.call_queue import call_queue_bp
from routes.call_management import call_management_bp
from routes.priority_management import priority_bp
from routes.sla_tracking import sla_bp
from routes.escalation import escalation_bp
from routes.streamlit import streamlit_bp
from routes.sentiment import sentiment_bp
from routes.admin_dashboard import admin_bp, manager_bp, agent_bp
from routes.feedback import feedback_bp
from routes.jokes import jokes_bp
from routes.knowledge_base import knowledge_bp
from routes.feedback_analysis import feedback_analysis_bp
from routes.auto_response import auto_response_bp
from routes.form_filling import form_filling_bp
from routes.agent_training import agent_training_bp
from routes.agent_scoring import agent_scoring_bp
from routes.email_routes import email_bp
from auth import auth_bp
from models import Role
from routes.audio_routes import audio_bp

# Initialize Flask App
app = Flask(__name__)
app.config.from_object("config.Config")

jwt = JWTManager(app)

# Initialize Extensions
CORS(app)
db.init_app(app)

# Create roles in the database if they do not exist
def create_roles():
    roles = ['admin', 'user', 'agent']
    with app.app_context():
        for role_name in roles:
            role = Role.query.filter_by(name=role_name).first()
            if not role:
                new_role = Role(name=role_name)
                db.session.add(new_role)
        db.session.commit()

# Register Blueprints
app.register_blueprint(batch_processing_bp, url_prefix="/api/batch-processing")
app.register_blueprint(document_upload_bp, url_prefix="/api/document-upload")
app.register_blueprint(form_processing_bp, url_prefix="/api/form-processing")
app.register_blueprint(call_queue_bp, url_prefix="/api/call-queue")
app.register_blueprint(call_management_bp, url_prefix="/api/calls")
app.register_blueprint(priority_bp, url_prefix="/api/priority-management")
app.register_blueprint(sla_bp, url_prefix="/api/sla-tracking")
app.register_blueprint(escalation_bp, url_prefix="/api/escalation")
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(admin_bp, url_prefix='/api')
app.register_blueprint(manager_bp, url_prefix='/api')
app.register_blueprint(agent_bp, url_prefix='/api')
app.register_blueprint(streamlit_bp, url_prefix="/api/streamlit")
app.register_blueprint(sentiment_bp, url_prefix="/api/sentiment")
app.register_blueprint(feedback_bp, url_prefix="/api/feedback")
app.register_blueprint(jokes_bp,url_prefix="/api/jokes")
app.register_blueprint(knowledge_bp,url_prefix="/api/knowledge")
app.register_blueprint(feedback_analysis_bp, url_prefix="/api/feedback_analysis")
app.register_blueprint(auto_response_bp,url_prefix="/api/auto_response")
app.register_blueprint(form_filling_bp,url_prefix="/api/form_filling")
app.register_blueprint(agent_training_bp,url_prefix="/api/agent_training")
app.register_blueprint(agent_scoring_bp,url_prefix="/api/agent_scoring")
app.register_blueprint(email_bp,url_prefix="/api/email")
app.register_blueprint(audio_bp, url_prefix="/api/audio")

# Initialize Scheduler (If you need to use it)
# from apscheduler.schedulers.background import BackgroundScheduler
# scheduler = BackgroundScheduler()
# scheduler.add_job(lambda: auto_escalate_calls(app), "interval", minutes=1)
# scheduler.start()

# Create Database Tables and Roles
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        create_roles()  # Ensure roles are created before the app starts
    app.run(debug=True)

