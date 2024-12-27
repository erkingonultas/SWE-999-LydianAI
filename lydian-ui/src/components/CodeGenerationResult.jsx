import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardActions, Typography, Box, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { CodeEditor } from './CodeEditor';
import { useCodeVersions } from '../hooks/useCodeVersions';
import axios from 'axios';
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import axiosInstance from '../utils/axiosInstance';

const initialReactCode = `import React from 'react';  

const Dummy = () => {  
    return (  
        <div className="flex items-center justify-center h-screen bg-gray-100">  
            <h1 className="text-4xl font-bold text-blue-600">Hello, World!</h1>  
        </div>  
    );  
};  

export default Dummy;
`;

export function CodeGenerationResult() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackText, setSnackText] = useState("");
  const previewRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [instruction, setInstruction] = useState("For example: Create a react app to calculate bills.");
  const [isFrontend, setIsFrontend] = useState(true);
  const [error, setError] = useState("");
  // const [code, setCode] = useState(initialReactCode);
  const { currentCode, addVersion, goToPreviousVersion, goToNextVersion, canGoBack, canGoForward } = useCodeVersions("");

  const logoutUser = async () => {
    try {
    await axiosInstance.post(`${process.env.REACT_APP_API_URL}/logout`);
    window.location.href = "/";
    } catch (error) {
      console.error(error);
      showSnack("Logout failed. Please try again later.");
    }
  };

  const showSnack = (text) => {
    setSnackText(text);
    setOpen(true);
  };

  const switchMode = () => {
    togglePreview();
    showSnack("A React code must be on the Workbench.");
  }

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

  const toggleListening = async () => {
    setIsListening(!isListening);
    setError("");
    setInstruction("");
    handleCodeChange("");
    setIsFrontend(false);

    try {
      // Send request to the Flask backend
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/generate`);
      showSnack("Prompt recieved...");
      if (response.data.success) {
        setInstruction(response.data.instruction);
        handleCodeChange(response.data.updated_code);
        setIsFrontend(response.data.is_frontend);
        showSnack("Code is being generated...");
      } else {
        setError(response.data.error || "An unknown error occurred.");
      }
      setIsListening(false);
    } catch (err) {
      setError(err);
    } finally {
      showSnack("Success");
      
    }
  };

  // const processSpeechToCode = () => {
  //   setIsListening(!isListening);
  //   setError("");
  //   setInstruction("");
  //   handleCodeChange("");
  //   setCode("");
  //   setIsFrontend(false);

  //   const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/process`);

  //   eventSource.onmessage = (event) => {
  //     const message = event.data;

  //     if (message.startsWith("Instruction received:")) {
  //       setInstruction(message.replace("Instruction received: ", ""));
  //     } else if (message.startsWith("Error:")) {
  //       setError(message.replace("Error: ", ""));
  //       setIsListening(false);
  //       eventSource.close();
  //     } else if (message === "Code generation complete.") {
  //       setIsListening(false);
  //       handleCodeChange(code);
  //       if (code.startsWith("import React")) {
  //         setIsFrontend(true)
  //       } else {
  //         setIsFrontend(false)
  //       }
  //       eventSource.close();
  //     } else if (message !== "" && !message.startsWith("Code generation started...") && !message.startsWith("Generating code from instruction") && !message.startsWith("Recognizing your speech...") && !message.startsWith("Listening to your speech...")) {
  //       console.log(message);
  //       setCode((prev) => prev + message.replace("   ", "\n").replace("  ", "\n").replace("};", "};\n").replace(");", ");\n").replace("';", "';\n")); // Append the new chunk of code
  //     }
  //   };
  //   // .replace("   ", "\n").replace("};", "};\n").replace("}", "}\n").replace(");", ");\n").replace("';", "';\n")

  //   eventSource.onerror = () => {
  //     setError("Connection to the server lost.");
  //     setIsListening(false);
  //     eventSource.close();
  //   };
  // };

  // SESSION MANAGEMENT
  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/@me/chats`);
        if (response.status === 200) {
          setSessions(response.data);
        } else {
          showSnack("Failed to fetch sessions");
          console.error('Failed to fetch sessions:', response.statusText);
        }
      } catch (error) {
        showSnack("Error fetching sessions");
        console.error('Error fetching sessions:', error);
      }
    }

    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      async function loadSession() {
        try {
          const session = sessions.find(session => session.id === selectedSessionId);
          if (!session) {showSnack("error when loading the session."); return;}
          handleCodeChange(session.code.toString());
          setInstruction('');
          showSnack("Session loaded.");
        } catch (error) {
          console.error('Error loading session:', error);
        }
      }

      loadSession();
    }
  }, [selectedSessionId]);

  async function createSession() {
    const sessionName = prompt("Enter a name for the session: ");
    if (sessionName) {
      try {
        const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/@me/chats/create`, {
          name: sessionName,
          code: initialReactCode
        });
        if (response.status === 201) {
          setSessions(prevSessions => [...prevSessions, response.data]);
          setSelectedSessionId(response.data.id);
          showSnack("Session created.");
        } else {
          console.error('Failed to create session:', response.statusText);
          showSnack("Failed to create session.");
        }
      } catch (error) {
        showSnack("Failed to create session.");
        console.error('Error creating session:', error);
      } 
    } else {
      alert("enter a name");
    }
  }

  const handleUpdateSession = async () => {
    try {
        const response = await axiosInstance.put(`${process.env.REACT_APP_API_URL}/@me/chats/${selectedSessionId}`, { code: currentCode });
        
        if (response.status === 200) {
          setSessions(sessions.map(session => 
            session.id === selectedSessionId ? { ...session, code: currentCode } : session
          ));
          showSnack("Session progress saved");
        } else {
          console.error('Failed to save session progress:', response.statusText);
        }
    } catch (error) {
      showSnack(`Error updating session: ${error}`, );
        console.error('Error updating session:', error);
    }
};

  async function deleteSession() {
    try {
      await axiosInstance.delete(`${process.env.REACT_APP_API_URL}/@me/chats/${selectedSessionId}`);
      setSessions(prevSessions => prevSessions.filter(session => session.id !== selectedSessionId));
      setSelectedSessionId(null);
      showSnack("Session deleted");
    } catch (error) {
      showSnack("Error deleting session");
      console.error('Error deleting session:', error);
    }
  }

  async function renameSession() {
    const sessionName = prompt("Enter a name for the session: ");
    if (sessionName) {
      try {
        const response = await axiosInstance.put(`${process.env.REACT_APP_API_URL}/@me/chat/rename/${selectedSessionId}`, {
          name: sessionName
        });
        if (response.status === 200) {
          setSessions(prevSessions => prevSessions.map(session =>
            session.id === selectedSessionId ? response.data : session
          ));
          showSnack(`Session renamed to ${sessionName}`);
        } else {
          console.error('Failed to rename session:', response.statusText);
        }
      } catch (error) {
        showSnack("Error renaming session");
        console.error('Error renaming session:', error);
      } 
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: 1 }}>
      <Card sx={{ width: '100%' }} variant="none">
        <CardHeader title={<Typography variant="h4" component="h2" fontWeight={900} gutterBottom align="center" sx={{
                                background: 'linear-gradient(45deg, #191919 30%, #6d8a91 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>LydianAI</Typography>} 
        action={
          <IconButton edge="end" aria-label="logout" onClick={logoutUser}>
            <Tooltip title="Logout">
            <LogoutIcon/>
            </Tooltip>
          </IconButton>
        }
        avatar={
          <div style={{ display: "flex", alignItems: "center"}}>
            <IconButton edge="end" aria-label="create-session" color={'primary'} onClick={() => createSession()} style={{ marginRight: "8px" }}>
              <Tooltip title="create a new session">
                <AddIcon/>
              </Tooltip>
            </IconButton>
            {sessions.length > 0 ?
            <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="user_sessions">Sessions</InputLabel>
            <Select
              labelId="user_sessions"
            id="user-sessions"
            value={selectedSessionId}
              label="Sessions"
              onChange={(e) => setSelectedSessionId(e.target.value)}
            >
              {sessions.map(session => (
                <MenuItem key={session.id} id={session.id} value={session.id}>{session.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
             : <Button
             onClick={() => createSession()}
             variant={'outlined'}
             color={'primary'}
           >
             Create a session
           </Button>}
            <IconButton edge="end" aria-label="rename-session" onClick={() => renameSession()} style={{ marginLeft: "3px" }}>
              <Tooltip title="rename selected session">
                <DriveFileRenameOutlineIcon/>
              </Tooltip>
            </IconButton>
            <IconButton edge="end" aria-label="delete-session" onClick={() => selectedSessionId == null ? null : deleteSession()} style={{ marginLeft: "8px", color: "red" }}>
              <Tooltip title="delete selected session">
                <DeleteIcon/>
              </Tooltip>
            </IconButton>
          </div>
          
        } />
      </Card>
      <Card sx={{ height: "78vh", maxWidth: '100%', width: isFrontend ? '100%' : 800, margin: 'auto' }}>
        <CardHeader
          title="Workbench"
          action={
            <Tooltip title="Render React codes" arrow placement="top">
              <Button
                aria-label="toggle-preview" onClick={() => switchMode()}
                variant={isListening ? 'contained' : 'outlined'}
                color={isListening ? 'secondary' : 'primary'}
                style={{ marginLeft: "auto" }}
                endIcon={<GraphicEqIcon />}
              >
                Change View
              </Button>
            </Tooltip>
          } />
          <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={handleClose}
            message={snackText}
          />
        <Box sx={{ paddingX: '20px' }} style={{ display: selectedSessionId == null ? "none" : "block" }}>
          <Typography variant="h7" fontWeight={"500"} gutterBottom>{error === "" ? "Prompt" : error}</Typography><br />
          <Typography variant="h8" fontWeight={"400"} gutterBottom>{instruction ?? error}</Typography>
        </Box>
        <CardContent>
          {selectedSessionId == null ? <Typography>Choose a session to start</Typography> :<Box height="56vh" >
            {!isFrontend && <Box sx={{ flex: 1 }}>
              <CodeEditor initialCode={currentCode} codeLanguage={isFrontend ? "javascript" : "python"} />
            </Box>}
            {(isFrontend && currentCode !== "") && <SandpackProvider
              template="react"

              files={{
                "App.js": currentCode,
              }}>
              <SandpackLayout style={{ height: "56vh" }}>
                <SandpackCodeEditor style={{ height: "56vh" }} options={{
                  editorHeight: 500,
                }} />
                <SandpackPreview
                  style={{ height: "56vh" }}
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
          </Box>}
        </CardContent>
        <CardActions style={{ display: selectedSessionId == null ? "none" : "flex" }}>
          <Button onClick={goToPreviousVersion} disabled={!canGoBack} sx={{ mr: 1 }}>
            Previous Version
          </Button>
          <Button onClick={goToNextVersion} disabled={!canGoForward}>
            Next Version
          </Button>
          <Button onClick={handleUpdateSession} disabled={(currentCode === "" && !canGoForward)}>
            Save
          </Button>
          <Button
            onClick={toggleListening}
            disabled={isListening}
            variant={isListening ? 'contained' : 'outlined'}
            color={isListening ? 'secondary' : 'primary'}
            style={{ marginLeft: "auto" }}
            endIcon={<KeyboardVoiceIcon />}
          >
            {isListening ? 'Listening' : 'Start'}
          </Button>
        </CardActions>
      </Card>
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="p" component="p" fontWeight={100} fontSize={12} color='#bbb'>A BOUN M.Sc. Software Engineering Graduate Project</Typography>
        <Typography variant="p" component="p" fontWeight={100} fontSize={14} color='#bbb'>Designed and developed by Erkin GÖNÜLTAŞ, instructed by Prof. Dr. Fatih ALAGÖZ</Typography>
      </Box>
    </Box>

  );
}
