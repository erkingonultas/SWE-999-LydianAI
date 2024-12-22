from flask import Flask
from flask_cors import CORS
from flask_session import Session
from dotenv import load_dotenv
from app.models.models import db, User
from app.utils.config import ApplicationConfig
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(ApplicationConfig)
    CORS(app, supports_credentials=True)
    Session(app)

    db.init_app(app)

    with app.app_context():
        db.create_all()
    
    # Register blueprints
    from app.routes.recognize import recognize_bp
    from app.routes.process import process_bp
    from app.routes.register import register_bp
    from app.routes.login import login_bp
    from app.routes.getme import current_user_bp
    from app.routes.logout import logout_bp

    app.register_blueprint(recognize_bp)
    app.register_blueprint(process_bp)
    app.register_blueprint(register_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(current_user_bp)
    app.register_blueprint(logout_bp)
    
    return app
