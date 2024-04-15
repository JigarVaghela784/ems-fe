import React from 'react'
import Grid from '@mui/material/Grid'
import { Box, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'

const LeaveInfomation = ({ leaves, users }) => {
  const totalPlanLeaves = leaves.filter(user => user.leaveType === 'Loss of Pay' || user.leaveType === 'Casual Leave')
  const totalUnplanLeaves = leaves.filter(user => user.leaveType === 'Medical Leave')

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={5}>
        <Grid item xs={3}>
          <Paper className='info'>
            <Typography variant='subtitle2' fontWeight={600}>
              Total Presents
            </Typography>
            <Typography variant='h6'>
              {leaves.length} / {users.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className='info'>
            <Typography variant='subtitle2' fontWeight={600}>
              Plan Leaves
            </Typography>{' '}
            <Typography variant='h6'>
              {totalPlanLeaves.length} <span style={{ fontSize: '12px' }}>Today</span>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className='info'>
            <Typography variant='subtitle2' fontWeight={600}>
              Unplanned Leaves
            </Typography>{' '}
            <Typography variant='h6'>
              {totalUnplanLeaves.length} <span style={{ fontSize: '12px' }}>Today</span>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className='info'>
            <Typography variant='subtitle2' fontWeight={600}>
              Pending Request
            </Typography>{' '}
            <Typography variant='h6'>12 / 60</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default LeaveInfomation
