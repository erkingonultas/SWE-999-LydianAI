import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { python, javascript } from 'react-syntax-highlighter/dist/esm/languages/hljs';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { diffLines } from 'diff';
import { Button, Box } from '@mui/material';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('python', python);

export function CodeEditor({ initialCode, onCodeChange, codeLanguage }) {
  const [code, setCode] = useState(initialCode);
  const [isTyping, setIsTyping] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 1000);
    return () => clearTimeout(timer);
  }, [initialCode]);

  const handleCodeChange = (newCode) => {
    if (newCode) {
      setCode(newCode);
      onCodeChange(newCode);
    }
  };

  const renderDiff = () => {
    const diff = diffLines(initialCode, code);
    return (
      <Box>
        {diff.map((part, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: part.added ? '#e6ffed' : part.removed ? '#ffeef0' : 'white',
            }}
          >
            <SyntaxHighlighter language={codeLanguage} style={docco}>
              {part.value}
            </SyntaxHighlighter>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{minHeight: 400}}>
        <SyntaxHighlighter language={codeLanguage} style={docco}>
          {initialCode}
        </SyntaxHighlighter>
        {/* {isTyping ? (
        <SyntaxHighlighter language={codeLanguage} style={docco}>
          {initialCode}
        </SyntaxHighlighter>
      ) : 
      showDiff ? (
        renderDiff()
      ) : 
      (
        <Editor
          height="300px"
          defaultLanguage={codeLanguage}
          defaultValue={initialCode}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineWidth: 40,
          }}
        />
      )} */}
        </Box>
      {/* <Button variant="contained" color="primary" onClick={() => setShowDiff(!showDiff)}>
        {showDiff ? 'Hide Diff' : 'Show Diff'}
      </Button> */}
    </Box>
  );
}
