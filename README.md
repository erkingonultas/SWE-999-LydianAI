# SWE-599-LydianAI
BOUN Software Engineering Master of Science Graduate Project

# Speech-Driven Coding using LLM

**LydianAI** is a full-stack software solution designed to revolutionize programming by enabling developers to generate, modify, and execute code using natural language speech inputs. Built with Flask and ReactJS, this project explores the intersection of **speech recognition**, **natural language processing**, and **software engineering**, offering a hands-free, intuitive, and collaborative coding experience.

## Key Features

- **Speech-to-Code Workflow**  
  - Transforms spoken coding instructions into executable code using **speech-to-text (STT)** technologies (e.g., Google Cloud Speech-to-Text) and **large language models (LLMs)** (e.g., OpenAI's GPT-4).
  - Allows conversational interactions to refine code, request explanations, or troubleshoot issues.

- **Real-Time Code Execution**  
  - Secure runtime environment for executing generated code.  
  - Immediate feedback with output logs and error reporting.

- **Interactive User Interface**  
  - Modern **single-page application (SPA)** built with ReactJS.  
  - Includes a real-time code editor, an output console, and voice input controls.

- **Session Management**  
  - Users can create, save, and resume coding sessions.  
  - Sessions include a personalized history of interactions and generated code.

- **Multi-Functional Use Cases**  
  - **Rapid Prototyping**: Quickly generate code snippets or boilerplates.  
  - **Learning and Debugging**: Gain insights and explanations for coding concepts.  
  - **Hands-Free Coding**: Useful for accessibility or multitasking.

## Technology Stack

### Backend
- **Flask**  
  - Handles authentication, session management, and API integration.  
  - Uses SQLite for database management.

- **LLM Integration**  
  - Integrates GPT-4 for natural language understanding and code generation.

### Frontend
- **ReactJS**  
  - Provides an interactive and responsive user interface.  
  - Includes features like a live editor, voice controls, and output visualization.

### Speech Recognition
- **Google Cloud Speech-to-Text**  
  - Powers the conversion of user speech into textual commands.

### Code Execution
- **Secure Sandbox**  
  - Ensures safety and isolation during code execution.  

## How It Works

1. **Voice Input**: Users provide coding instructions through speech.  
2. **Speech-to-Text**: STT systems transcribe the input into text.  
3. **Natural Language Understanding**: The LLM interprets and generates relevant code snippets.  
4. **Code Refinement**: Users iteratively refine the code through conversational input.  
5. **Execution**: Code is executed in a sandbox, and results are displayed in real-time.

### Example Workflow:
1. **User Input**: *"Create a React component that fetches data from an API and displays it in a list."*  
   - **LLM Output**: A functional React component with an API call.
2. **User Input**: *"Add error handling and a loading spinner."*  
   - **LLM Output**: Enhanced code with error handling and a loading indicator.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/erkingonultas/SWE-999-LydianAI
   cd SWE-999-LydianAI
   ```
2. Set up the backend:
  - Install Python dependencies:
    ```bash
    cd lydian-api
    pip install -r requirements.txt
    ```
  - Run the Flask server:
    ```bash
    python src/app.py
    ```
3. Set up the frontend:
  - Navigate to the frontend directory:
    ```bash
    cd lydian-ui
    ```
  - Install dependencies and start the React development server:
    ```bash
    npm install
    npm start
    ```
4. Configure environment variables for STT and LLM APIs.

## Future Development

- Transition to a SaaS model for broader accessibility.
- Integration of advanced authentication mechanisms (e.g., MFA).
- Support for multi-file projects and enhanced session management.
- Development of a dedicated, fine-tuned LLM for improved code generation accuracy.
