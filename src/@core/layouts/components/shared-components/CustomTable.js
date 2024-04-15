import React from 'react'
import Box from '@mui/material/Box'
import { DataGridPro } from '@mui/x-data-grid-pro'

const CustomTable = ({ columns, rows, onRowClick, ...res }) => {
  return (
    <Box sx={{ height: 530, width: '100%' }} className='data-table-wrapper'>
      <DataGridPro
        pagination
        rows={rows}
        columns={columns}
        onRowClick={onRowClick}
        pageSizeOptions={[10, 25, 50]}
        {...res}
      />
    </Box>
  )
}

export default CustomTable
