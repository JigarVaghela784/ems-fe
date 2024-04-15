import React from 'react'
import { Box, Modal, Typography } from '@mui/material'
import CloseCircle from 'mdi-material-ui/CloseCircle'

const CustomModal = ({ open, width = 400, handleClose, title, children, className }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    display: 'flex',
    flexFlow: 'column',
    gap: 8
  }

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby='modal-title' aria-describedby='modal-description'>
      <Box sx={style} className={className}>
        <Box className='modal-content' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id='modal-modal-title' variant='h6' component='h2' align='center' sx={{ width: '100%' }}>
            {title}
          </Typography>
          <CloseCircle onClick={handleClose} sx={{ cursor: 'pointer' }} />
        </Box>
        {children}
      </Box>
    </Modal>
  )
}

export default CustomModal
