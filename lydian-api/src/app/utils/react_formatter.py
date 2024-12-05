def format_react_code(react_code):
    """Format React code for consistent structure."""
    if "import React" not in react_code:
        react_code = "import React from 'react';\n\n" + react_code
    if "export default" not in react_code:
        react_code += "\n\nexport default App;"
    react_code = react_code.replace("class=", "className=")
    return react_code
