import React from 'react'
import { Box, Modal, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import CustomButton from './CustomButton'

const CustomRemoveModal = ({ open, handleClose, title, description, onConfirm, deleteLoading }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
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
      <Box sx={style}>
        <Box className='modal-content'>
          <Typography id='modal-modal-title' variant='h6' component='h2' align='center' sx={{ width: '100%' }}>
            {title}
          </Typography>
          <Typography id='modal-modal-title' variant='subtitle1' component='h2' align='center' sx={{ width: '100%' }}>
            {description}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 10 }}>
          <Button fullWidth color='secondary' size='large' variant='contained' onClick={handleClose}>
            Cancel
          </Button>
          <CustomButton loading={deleteLoading} onClick={onConfirm}>
            Delete
          </CustomButton>
        </Box>
      </Box>
    </Modal>
  )
}

export default CustomRemoveModal
