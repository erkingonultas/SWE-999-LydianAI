import { CodeGenerationResult } from './components/CodeGenerationResult'
import { Box, Typography, ThemeProvider, createTheme } from '@mui/material'
import './App.css';

const theme = createTheme({
  typography: {
    fontFamily:
      'Rubik',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      padding: 3 
    }}>
      <Typography variant="h3" component="h1" fontWeight={900} gutterBottom>
        LydianAI
      </Typography>
      <CodeGenerationResult />
    </Box>
    </ThemeProvider>
  );
}

export default App;
