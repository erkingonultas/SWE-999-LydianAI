import React, { useState, useEffect } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { python, javascript } from 'react-syntax-highlighter/dist/esm/languages/hljs';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Box } from '@mui/material';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);

export function CodeEditor({ initialCode, codeLanguage }) {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: "57vh", overflow: "scroll" }}>
        <Box sx={{minHeight: 400}}>
        <SyntaxHighlighter language={codeLanguage} style={docco}>
          {initialCode}
        </SyntaxHighlighter>
        </Box>
    </Box>
  );
}
