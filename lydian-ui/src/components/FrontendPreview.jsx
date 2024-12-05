import React from 'react'
import DummyComponent from '../dummy/dummy';
import { Box } from '@mui/material'

export function FrontendPreview({ code }) {
  return (
    <Box sx={{ width: '100%', height: '100%', border: '1px solid #ccc', borderRadius: 2, overflow: 'hidden' }}>
      <DummyComponent/>
    </Box>
  )
}