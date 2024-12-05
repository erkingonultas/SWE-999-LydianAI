from flask import Blueprint, jsonify
import speech_recognition as sr

recognize_bp = Blueprint("recognize", __name__)

@recognize_bp.route('/recognize', methods=['POST'])
def recognize_speech():
    """API endpoint to recognize speech and convert it to text."""
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        try:
            audio = recognizer.listen(source)
            speech_text = recognizer.recognize_google(audio)
            return jsonify({"success": True, "speech_text": speech_text})
        except sr.UnknownValueError:
            return jsonify({"success": False, "error": "Could not understand audio."}), 400
        except sr.RequestError:
            return jsonify({"success": False, "error": "Speech Recognition service error."}), 500
