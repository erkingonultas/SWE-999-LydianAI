from flask import Flask, jsonify, request, Blueprint, session
from flask_bcrypt import Bcrypt
from app.models.models import db, User

register_bp = Blueprint("register", __name__)

@register_bp.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None # if user is already exists, returns true
    if user_exists:
        return jsonify({
            "error": "User already exists"
        }), 409
    hashed_password = Bcrypt().generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    }), 200
