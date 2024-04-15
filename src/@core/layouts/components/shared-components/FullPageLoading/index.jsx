import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'

const FullPageLoading = () => {
  return (
    <div
      style={{
        background: '#fff',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      }}
    >
      <CircularProgress />
    </div>
  )
}

export default FullPageLoading
