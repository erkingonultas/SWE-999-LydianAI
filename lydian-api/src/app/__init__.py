from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Register blueprints
    from app.routes.recognize import recognize_bp
    from app.routes.process import process_bp

    app.register_blueprint(recognize_bp)
    app.register_blueprint(process_bp)
    
    return app
