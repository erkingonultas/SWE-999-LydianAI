import {React, useState, useEffect} from "react"
import { ThemeProvider, createTheme } from '@mui/material'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import { CodeGenerationResult } from './components/CodeGenerationResult';
import axiosInstance from "./utils/axiosInstance";
import Register from "./components/RegisterPage";

const theme = createTheme({
  palette: {
    primary: {
      main: '#191919',
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Rubik',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    Button: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
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
          <Route path="/register" element={user == null ? <Register /> : <CodeGenerationResult />}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
