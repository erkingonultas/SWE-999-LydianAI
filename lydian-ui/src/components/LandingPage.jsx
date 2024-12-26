import React from 'react';
import { Box, Typography, Button } from '@mui/material'


const LandingPage = () => {

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#f9f9f9',
        }}>
            <Typography variant="h1" style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#000',
            }}>
                Welcome to LydianAI
            </Typography>
            <Typography variant="body1" style={{
                fontSize: '2rem',
                color: '#666',
                marginBottom: '2rem',
            }}>
                Join the future of programming with Speech-Driven Coding using LLM platform.
            </Typography>
            <Button href='/login' variant="contained" color="primary" style={{
                fontSize: '1.5rem',
                padding: '1rem 3rem',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: '#0062cc',
                },
            }}>
                Get Started
            </Button>
        </div>
    );
};

export default LandingPage;
