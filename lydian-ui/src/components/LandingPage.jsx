import React from 'react';
import { Box, Button, Container, Typography, Paper, Grid } from '@mui/material'
import { Mic, Code, Speed, AutoAwesome } from '@mui/icons-material'
import { motion } from 'framer-motion'


const LandingPage = () => {

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    const features = [
        {
            icon: <Mic sx={{ fontSize: 40 }} />,
            title: "Voice-Powered",
            description: "Code naturally using your voice with advanced speech recognition"
        },
        {
            icon: <Code sx={{ fontSize: 40 }} />,
            title: "LLM Integration",
            description: "Powered by state-of-the-art language models for accurate code generation"
        },
        {
            icon: <Speed sx={{ fontSize: 40 }} />,
            title: "Real-time Processing",
            description: "Get instant code suggestions and completions as you speak"
        },
        {
            icon: <AutoAwesome sx={{ fontSize: 40 }} />,
            title: "Smart Context",
            description: "Intelligent understanding of your coding context and requirements"
        }
    ]

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 }, mb: { xs: 8, md: 12 } }}>
                <motion.div {...fadeIn}>
                    <Box textAlign="center" mb={8}>
                        <Typography
                            component="h1"
                            variant="h2"
                            sx={{
                                fontWeight: 700,
                                mb: 3,
                                background: 'linear-gradient(45deg, #191919 30%, #6d8a91 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Welcome to LydianAI
                        </Typography>
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}
                        >
                            Join the future of programming with Speech-Driven Coding using LLM platform.
                        </Typography>
                        <Button
                            variant="contained"
                            id="gradient_btn"
                            href='/login'
                            size="large"
                            sx={{
                                py: 2,
                                px: 4,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                background: 'linear-gradient(45deg, #191919 30%, #6d8a91 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #6d8a91 30%, #191919 90%)',
                                }
                            }}
                        >
                            Get Started
                        </Button>
                    </Box>
                </motion.div>

                {/* Features Grid */}
                <Grid container spacing={4} sx={{ mt: 8 }}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '210px',
                                        textAlign: 'center',
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(33, 150, 243, 0.04)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(33, 150, 243, 0.08)',
                                            transform: 'translateY(-4px)',
                                            transition: 'all 0.3s ease'
                                        }
                                    }}
                                >
                                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h6" component="h3" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 4,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: 'rgba(33, 150, 243, 0.04)',
                    borderTop: '1px solid rgba(0, 0, 0, 0.08)'
                }}
            >
                <Container maxWidth="lg">
                    <Box textAlign="center">
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            A BOUN M.Sc. Software Engineering Graduate Project
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Designed and developed by Erkin GÖNÜLTAŞ, instructed by Prof. Dr. Fatih ALAGÖZ
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            © {new Date().getFullYear()} LydianAI. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;
