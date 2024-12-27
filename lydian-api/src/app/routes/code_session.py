from flask import Blueprint, request, jsonify, session
from app.models.models import db, Chat

chats_bp = Blueprint("chats", __name__)

@chats_bp.route('/@me/chats/create', methods=['POST'])
def create_chat():
    chat_data = request.json
    print(chat_data)
    if 'name' in chat_data:
        new_chat = Chat(name=chat_data['name'], owner_id=session.get('user_id'), code=chat_data['code'])
        db.session.add(new_chat)
        db.session.commit()
        return jsonify({"id": new_chat.id, "name": new_chat.name, "code": new_chat.code}), 201
    return jsonify({"error": "Chat name is required"}), 400

@chats_bp.route('/@me/chats/<string:chat_id>', methods=['PUT'])
def update_chat(chat_id):
    chat_data = request.json
    chat_obj = Chat.query.filter_by(id=chat_id, owner_id=session.get('user_id')).first()
    if not chat_obj:
        print("@@@@@@@@@@@@@@@@@@@@@@@@ ????????")
        return jsonify({"error": "Chat not found"}), 404
    if 'code' in chat_data:
        chat_obj.code = chat_data['code']
        db.session.commit()
    return jsonify({"id": chat_obj.id, "code": chat_obj.code}), 200

@chats_bp.route('/@me/chats/<string:chat_id>', methods=['DELETE'])
def delete_chat(chat_id):
    chat_obj = Chat.query.filter_by(id=chat_id, owner_id=session.get('user_id')).first()
    if not chat_obj:
        return jsonify({"error": "Chat not found"}), 404
    db.session.delete(chat_obj)
    db.session.commit()
    return jsonify({"message": "Chat deleted successfully"}), 200

@chats_bp.route('/@me/chat/rename/<string:chat_id>', methods=['PUT'])
def rename_chat(chat_id):
    if 'user_id' in session:
        user_id = session.get("user_id")
        data = request.json
        new_name = data.get('name')

        chat_obj = Chat.query.filter_by(id=chat_id, owner_id=user_id).first()

        if not chat_obj:
            return jsonify({"error": "Chat not found."}), 404

        chat_obj.name = new_name
        db.session.commit()

        return jsonify({
            "id": chat_obj.id,
            "owner_id": chat_obj.owner_id,
            "name": chat_obj.name,
            "creation_date": chat_obj.creation_date.isoformat(),
            "code": chat_obj.code
        }), 200

    return jsonify({"error": "No cookie found."}), 404

@chats_bp.route('/@me/chats', methods=['GET'])
def get_chats():
    if 'user_id' in session:
        user_id = session.get("user_id")
        chats = Chat.query.filter_by(owner_id=user_id).all()
        return jsonify([
            {
                'id': chat.id,
                'name': chat.name,
                'creation_date': chat.creation_date.isoformat(),
                'code': chat.code
            }
            for chat in chats
        ])
    return jsonify({"error": "No cookie found."}), 404
