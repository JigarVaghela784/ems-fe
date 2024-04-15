import * as React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

export default function Loader({ minHeight }) {
  return (
    <Box sx={{ display: 'flex', minHeight: minHeight, justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress />
    </Box>
  )
}
