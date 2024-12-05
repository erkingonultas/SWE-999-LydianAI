def clean_code(code):
    """Remove code block formatting."""
    if code.startswith("```") and code.endswith("```"):
        code = "\n".join(code.split("\n")[1:-1])
    return code
