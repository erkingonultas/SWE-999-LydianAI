import {React, useState, useEffect} from "react"
import { ThemeProvider, createTheme } from '@mui/material'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import { CodeGenerationResult } from './components/CodeGenerationResult';
import axiosInstance from "./utils/axiosInstance";

const theme = createTheme({
  typography: {
    fontFamily:
      'Rubik',
  },
});

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosInstance
      .get('/@me')
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
        setUser(null);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path='*' element={user == null ? <LandingPage /> : <CodeGenerationResult />}></Route>
          <Route path='/product' element={user == null ? <LandingPage /> : <CodeGenerationResult />}></Route>
          <Route path="/login" element={user == null ? <LoginPage /> : <CodeGenerationResult />}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
