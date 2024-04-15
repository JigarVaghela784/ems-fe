import React from 'react'
import { Card, CardContent, CardHeader } from '@mui/material'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import { CircleSlice8 } from 'mdi-material-ui'
import dayjs from 'dayjs'

const ProjectDetail = ({ project = {} }) => {
  const { cost, weeklyHours, createdDate, deadlineDate, priority, status } = project

  const getIcon = priority => {
    switch (priority) {
      case 'High':
        return <CircleSlice8 style={{ color: 'red', fontSize: 16, marginRight: 2 }} />
      case 'Normal':
        return <CircleSlice8 style={{ color: '#1883C2', fontSize: 16, marginRight: 2 }} />
      case 'Low':
        return <CircleSlice8 style={{ color: 'green', fontSize: 16, marginRight: 2 }} />
      default:
        return <CircleSlice8 style={{ color: 'red', fontSize: 16, marginRight: 2 }} />
    }
  }

  return (
    <Card variant='outlined'>
      <CardHeader className='them-color' title='Project Details' />
      <CardContent>
        <TableContainer component={Paper}>
          <Table aria-label='caption table'>
            <TableHead />
            <TableBody>
              {/*<TableRow>*/}
              {/*  <TableCell component='th' scope='row'>*/}
              {/*    Cost:*/}
              {/*  </TableCell>*/}
              {/*  <TableCell align='right'>{cost || 0}</TableCell>*/}
              {/*</TableRow>*/}
              <TableRow>
                <TableCell component='th' scope='row'>
                  Weekly Hours:
                </TableCell>
                <TableCell align='right'>{weeklyHours} Hours</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component='th' scope='row'>
                  Created:
                </TableCell>
                <TableCell align='right'>
                  {createdDate ? dayjs(createdDate).format('DD MMM, YYYY') : 'No date'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component='th' scope='row'>
                  Deadline:
                </TableCell>
                <TableCell align='right'>
                  {deadlineDate ? dayjs(deadlineDate).format('DD MMM, YYYY') : 'No date'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component='th' scope='row'>
                  Priority:
                </TableCell>
                <TableCell align='right'>
                  <div className='d-flex align-center justify-end'>
                    {getIcon(priority)}

                    {priority}
                  </div>
                </TableCell>
              </TableRow>
              {/*<TableRow>*/}
              {/*  <TableCell component='th' scope='row'>*/}
              {/*    Created by:*/}
              {/*  </TableCell>*/}
              {/*  <TableCell align='right'>Barry Cuda</TableCell>*/}
              {/*</TableRow>*/}
              <TableRow>
                <TableCell component='th' scope='row'>
                  Status:
                </TableCell>
                <TableCell align='right'>{status}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default ProjectDetail
