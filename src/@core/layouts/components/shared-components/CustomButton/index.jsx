import React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

const CustomButton = ({ loading, children, loadingProps = {}, ...res }) => {
  return (
    <Button fullWidth size='large' variant='contained' disabled={loading} sx={{ borderRadius: '6px' }} {...res}>
      {loading ? <CircularProgress size={20} style={{ color: '#fff' }} {...loadingProps} /> : children}
    </Button>
  )
}

export default CustomButton
