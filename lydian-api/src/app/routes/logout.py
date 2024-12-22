from flask import Flask, jsonify, request, Blueprint, session
from flask_bcrypt import Bcrypt
from app.models.models import db, User


logout_bp = Blueprint("logout", __name__)

@logout_bp.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"