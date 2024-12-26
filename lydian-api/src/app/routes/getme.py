from flask import Blueprint, jsonify, session
from app.models.models import User

current_user_bp = Blueprint("@me", __name__)

@current_user_bp.route("/@me")
def get_current_user():
    # user_id = session.get("user_id")

    # if not user_id:
    #     return jsonify({"error": "SDFGSDFGSDF"}), 401
    
    # user = User.query.filter_by(id=user_id).first()
    # return jsonify({
    #             'id': user.id,
    #             'email': user.email
    #         })
    user_info = None
    if 'user_id' in session:
        user_id = session.get("user_id")
        # Assuming there is a function called `get_user_by_id` that retrieves a user object by their ID
        user = User.query.filter_by(id=user_id).first()
        if user:
            user_info = {
                'id': user.id,
                'email': user.email
            }
            return jsonify(user_info), 200
        else:
            return jsonify({"error": "Unauthorized"}), 401
    return jsonify({"error": "No cookie found."}), 404
    
