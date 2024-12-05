from flask import Blueprint, Response
from app.utils.openai_client import generate_code
from app.utils.clean_code import clean_code
import speech_recognition as sr

process_bp = Blueprint("process", __name__)

current_code = ""

@process_bp.route('/process', methods=['GET'])
def process_speech_to_code():
    """Stream the process of converting speech to code."""
    def generate_response():
        global current_code
        try:
            recognizer = sr.Recognizer()
            with sr.Microphone() as source:
                yield "data: Listening to your speech...\n\n"
                audio = recognizer.listen(source)
            
            yield "data: Recognizing your speech...\n\n"
            try:
                instruction = recognizer.recognize_google(audio)
                yield f"data: Instruction received: {instruction}\n\n"
            except sr.UnknownValueError:
                yield "data: Error: Could not understand the audio.\n\n"
                return
            except sr.RequestError:
                yield "data: Error: Could not connect to Google Speech Recognition API.\n\n"
                return
            
            # Generate code from instruction
            yield "data: Generating code from instruction...\n\n"
            response_stream = generate_code(current_code, instruction)

            updated_code = ""
            for chunk in response_stream:
                updated_code += chunk
                print(chunk)
                yield f"data: {chunk}\n\n"
            
            current_code = updated_code
            yield "data: Code generation complete.\n\n"

        except Exception as e:
            yield f"data: Error: {str(e)}\n\n"

    return Response(generate_response(), content_type="text/event-stream")
