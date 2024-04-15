import React, { forwardRef } from 'react'
import { TextField } from '@mui/material'

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} fullWidth {...props} />
})

export default CustomInput
