import React, { useState, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardActions, Typography, Box, IconButton, Tooltip } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import { CodeEditor } from './CodeEditor';
import { useCodeVersions } from '../hooks/useCodeVersions';
import axios from 'axios';
import {
    SandpackProvider,
    SandpackCodeEditor,
    SandpackLayout,
    SandpackPreview,
  } from "@codesandbox/sandpack-react";

const initialCode = `def multiply(a, b):
    return a * b
`;

const initialReactCode = `import React, { useState } from 'react';

const Dummy = () => {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        setCount(count - 1);
    };

    const reset = () => {
        setCount(0);
    };

    return (
        <div className="flex flex-col items-center m-4 p-4 bg-gray-100 rounded shadow">
            <h1 className="text-2xl mb-4">Counter: {count}</h1>
            <div className="flex space-x-4">
                <button onClick={increment} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                    Increment
                </button>
                <button onClick={decrement} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                    Decrement
                </button>
                <button onClick={reset} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Dummy;
`;

export function CodeGenerationResult() {
  const [open, setOpen] = useState(false);
  const previewRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [instruction, setInstruction] = useState("Create a function to multiply two numbers");
  const [isFrontend, setIsFrontend] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const { currentCode, addVersion, goToPreviousVersion, goToNextVersion, canGoBack, canGoForward } = useCodeVersions(initialCode);

  const handleClick = () => {
    setOpen(true);
    togglePreview();
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  
  const togglePreview = () => {
      setIsFrontend(!isFrontend);
  }

  const handleCodeChange = (newCode) => {
    addVersion(newCode);
  };  

  const toggleListening =  async () => {
    setIsListening(!isListening);
    setError("");
    setInstruction("");
    handleCodeChange("");
    setIsFrontend(false);

    try {
      // Send request to the Flask backend
      const response = await axios.post("http://127.0.0.1:5000/process");
      if (response.data.success) {
        setInstruction(response.data.instruction);
        handleCodeChange(response.data.updated_code);
        setIsFrontend(response.data.is_frontend);
      } else {
        setError(response.data.error || "An unknown error occurred.");
      }
    } catch (err) {
      setError("Failed to connect to the backend. Ensure the Flask server is running.");
    } finally {
        setIsListening(false);
    }
  };

  const processSpeechToCode = () => {
    setIsListening(!isListening);
    setError("");
    setInstruction("");
    handleCodeChange("");
    setCode("");
    setIsFrontend(false);

    const eventSource = new EventSource("http://127.0.0.1:5000/process");

    eventSource.onmessage = (event) => {
      const message = event.data;

      if (message.startsWith("Instruction received:")) {
        setInstruction(message.replace("Instruction received: ", ""));
      } else if (message.startsWith("Error:")) {
        setError(message.replace("Error: ", ""));
        setIsListening(false);
        eventSource.close();
      } else if (message === "Code generation complete.") {
        setIsListening(false);
        handleCodeChange(code);
        if(code.startsWith("import React")) {
            setIsFrontend(true)
        } else {
            setIsFrontend(false)
        }
        eventSource.close();
      } else if (message !== "" && !message.startsWith("Code generation started...") && !message.startsWith("Generating code from instruction") && !message.startsWith("Recognizing your speech...") && !message.startsWith("Listening to your speech...")) {
        setCode((prev) => prev + message.replace("   ", "\n").replace("};", "};\n").replace("';", "';\n")); // Append the new chunk of code
      }
    };

    eventSource.onerror = () => {
        setError("Connection to the server lost.");
        setIsListening(false);
        eventSource.close();
      };
  }; 

  return (
    <Card sx={{ maxWidth: '100%', width: isFrontend ? '100%' : 800, margin: 'auto' }}>
      <CardHeader 
        title="Workbench"
        action={
          <Tooltip title="Render React codes" arrow placement="top">
            <IconButton aria-label="toggle-preview" onClick={handleClick}>
              <GraphicEqIcon />
            </IconButton>
            <Snackbar
              open={open}
              autoHideDuration={5000}
              onClose={handleClose}
              message="A React code must be on the Workbench."
            />
          </Tooltip>
        }/>
      <Box sx={{paddingX: '20px'}}>
        <Typography variant="h7" fontWeight={"500"} gutterBottom>{error == "" ? "Prompt" : error}</Typography><br />
        <Typography variant="h8" fontWeight={"400"} gutterBottom>{instruction ?? error}</Typography>
      </Box>
      <CardContent>
        <Box >
          {!isFrontend && <Box sx={{ flex: 1 }}>
            <CodeEditor initialCode={code} onCodeChange={handleCodeChange} codeLanguage={isFrontend ? "javascript" : "python"} />
          </Box>}
            {isFrontend && <SandpackProvider 
                template="react"
                files={{
                        "App.js": code,
                }}>
                <SandpackLayout>
                    <SandpackCodeEditor options={{
                        editorHeight: 500,
                    }}/>
                    <SandpackPreview
                    ref={previewRef}
                    actionsChildren={
                        <button
                        onClick={() => {
                            const client = previewRef.current?.getClient();
                            if (!client) return;

                            const tailwindCdn = "https://cdn.tailwindcss.com";
                            const externalResources =
                            client.options.externalResources?.includes(tailwindCdn)
                                ? []
                                : ["https://cdn.tailwindcss.com"];

                            client.updateOptions({ ...client.options, externalResources });
                            client.dispatch({ type: "refresh" });
                        }}
                        >
                        Toggle Tailwind
                        </button>
                    }
                    />
                </SandpackLayout>
            </SandpackProvider>
            }
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
          <Box>
            
          </Box>
          
        </Box>
      </CardContent>
      <CardActions>
          <Button onClick={goToPreviousVersion} disabled={!canGoBack} sx={{ mr: 1 }}>
            Previous Version
          </Button>
          <Button onClick={goToNextVersion} disabled={!canGoForward}>
            Next Version
          </Button>
          <Button
            onClick={processSpeechToCode}
            disabled={isListening}
            variant={isListening ? 'contained' : 'outlined'}
            color={isListening ? 'secondary' : 'primary'}
            style={{marginLeft: "auto"}}
            endIcon={<KeyboardVoiceIcon/>}
          >
            {isListening ? 'Listening' : 'Start'}
          </Button>
      </CardActions>
    </Card>
  );
}
