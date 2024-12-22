import React, { useState } from 'react';
import { Button, Container, Paper, TextField } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/login`, { email, password });
      if (response.status == "200") {
        window.location.href = '/product';
      } else {
        alert(response.statusText);
      }
    } catch (error) {
      console.error('Error during loggin in:', error);
      alert(error.response.data.error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <TextField
            label="E-mail"
            value={email}
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="secondary">
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginPage;