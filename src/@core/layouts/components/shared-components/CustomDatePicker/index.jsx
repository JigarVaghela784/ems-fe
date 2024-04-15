import React from 'react'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const CustomDatePicker = ({ sx = {}, format = 'DD-MM-YYYY', ...res }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker format={format} sx={{ width: '100%', ...sx }} {...res} />
    </LocalizationProvider>
  )
}

export default CustomDatePicker
