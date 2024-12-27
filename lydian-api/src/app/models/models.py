from uuid import uuid4
from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)

    # Add a relationship to saved contents
    chats = db.relationship('Chat', backref='owner', lazy=True)

    def __repr__(self):
        return f"<User {self.id}>"

class Chat(db.Model):
    __tablename__ = "chats"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    owner_id = db.Column(db.String(32), db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    creation_date = db.Column(db.DateTime, default=db.func.now(), nullable=False)
    code = db.Column(db.Text)

    def __repr__(self):
        return f'<Chat {self.name}>'
    
# flask db init
# flask db migrate -m "add saved content model"
# flask db upgrade