import openai
from flask import Blueprint, Response, jsonify
from app.utils.clean_code import clean_code
from app.utils.react_formatter import format_react_code
import os
import speech_recognition as sr

generate_bp = Blueprint("generate", __name__)

openai.api_key = os.getenv("OPENAI_API_KEY")

current_code = ""

systemPrompt = """
    You are a helpful expert software engineer assistant. Your task is to assist users in generating and improving code.
    Always maintain the context of prior instructions and edits when generating new code. Return only the updated code. 
    If it is about a function, always use python.
    If it is a react component always name it to dummy. Use javascript as the language for the React component. If you use any imports from React like useState or useEffect, make sure to import them directly. Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \`h-[600px]\`). Make sure to use a consistent color palette. Use Tailwind margin and padding classes to style the components and ensure the components are spaced out nicely. NO LIBRARIES (e.g. zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.  
    Please ONLY return the full code. to make multi-line: 1. identify positions to emit newline;\nuse the escape sequence ‘\n’ to represent the end of a line. It's very important for my job that you only return the code with imports. DO NOT START WITH \`\`\`python or \`\`\`javascript or \`\`\`jsx or \`\`\`.
"""
@generate_bp.route('/generate', methods=['POST'])
def generate_code():
    """Generate code based on the user's instruction."""
    global current_code
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        try:
            audio = recognizer.listen(source)
            instruction = recognizer.recognize_google(audio)
        except sr.UnknownValueError:
            return jsonify({"success": False, "error": "Could not understand audio."}), 400
        except sr.RequestError:
            return jsonify({"success": False, "error": "Speech recognition service error."}), 500

    messages = [
        {"role": "system", "content": systemPrompt},
        {"role": "assistant", "content": "The current function being edited or created is:"},
        {"role": "assistant", "content": current_code},
        {"role": "user", "content": instruction}
    ]
    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        updated_code = response.choices[0].message.content
        updated_code = clean_code(updated_code)

        is_frontend = "React" in updated_code or "return" in updated_code and "JSX" in updated_code

        if is_frontend:
            updated_code = format_react_code(updated_code)
        current_code = updated_code
        return jsonify({"success": True, "instruction": instruction, "updated_code": updated_code, "is_frontend": is_frontend})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
        
        
    # response = openai.chat.completions.create(
    #     model="gpt-4o-mini",
    #     messages=messages,
    #     stream=True
    # )
    # for chunk in response:
    #     if chunk.choices[0].delta.content is not None:
    #         code_piece = chunk.choices[0].delta.content
    #         if code_piece:
    #             yield code_piece