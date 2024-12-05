import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

systemPrompt = """
    You are a helpful expert software engineer assistant. Your task is to assist users in generating and improving code.
    Always maintain the context of prior instructions and edits when generating new code. Return only the updated code. 
    If it is about a function, always use python.
    If it is a react component always name it to dummy. Use javascript as the language for the React component. If you use any imports from React like useState or useEffect, make sure to import them directly. Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \`h-[600px]\`). Make sure to use a consistent color palette. Use Tailwind margin and padding classes to style the components and ensure the components are spaced out nicely. NO LIBRARIES (e.g. zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.  
    Please ONLY return the full code. to make multi-line: 1. identify positions to emit newline;\nuse the escape sequence ‘\n’ to represent the end of a line. It's very important for my job that you only return the code with imports. DO NOT START WITH \`\`\`python or \`\`\`javascript or \`\`\`jsx or \`\`\`.
"""

def generate_code(current_code, instruction):
    """Generate code based on the user's instruction."""
    messages = [
        {"role": "system", "content": systemPrompt},
        {"role": "assistant", "content": "The current function being edited or created is:"},
        {"role": "assistant", "content": current_code},
        {"role": "user", "content": instruction}
    ]
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        stream=True
    )
    for chunk in response:
        if chunk.choices[0].delta.content is not None:
            code_piece = chunk.choices[0].delta.content
            if code_piece:
                yield code_piece
