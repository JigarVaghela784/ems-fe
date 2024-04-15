import { Box, Button, Input, InputLabel, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomTable from '../../../layouts/components/shared-components/CustomTable'
import CustomBreadcrumb from '../../../layouts/components/shared-components/CustomBreadcrumb'
import CloudUploadIcon from 'mdi-material-ui/CloudUpload'
import Check from 'mdi-material-ui/Check'
import Close from 'mdi-material-ui/Close'
import AttendanceModal from '../AttendanceModal'
import Loader from 'src/components/Loader'

const AttendanceInfo = () => {
  const [rowArray, setRowArray] = useState([])
  const [tableRows, setTableRows] = useState([])
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState()
  const [isOpen, setIsOpen] = useState({ open: false, data: '' })

  const handleCloseModal = () => {
    setIsOpen({ open: false, data: '' })
  }

  const handleFileChange = async event => {
    const file = event.target.files[0]
    setFileName(file.name)
    if (file) {
      const reader = new FileReader()

      reader.onload = e => {
        const text = e.target.result
        const lines = text.split('\n') // Split the CSV into lines
        const rows = lines.map(line => line.split(',')) // Split each line into an array of values

        const result = rows.reduce((acc, currentValue) => {
          if (acc.length === 0 || acc[acc.length - 1].length === 8) {
            // If the accumulator is empty or the last inner array has 8 elements, start a new inner array.
            acc.push([currentValue])
          } else {
            // Otherwise, add the current value to the last inner array.
            acc[acc.length - 1].push(currentValue)
          }

          return acc
        }, [])

        const data = result.map(d => {
          const obj = { id: '', name: '', days: [] }
          d.forEach((info, i) => {
            if ([0].includes(i)) return
            if (i === 1) {
              obj.id = info[0]
              obj.name = info[1]
            }
            if ([2, 3, 4, 5, 6, 7].includes(i)) {
              info.forEach((d, i) => {
                if (i === 0) return
                obj.days[i] = { ...obj.days[i], [info[0] || 'date']: d }
              })
            }
          })

          return obj
        })

        setRowArray(data)
      }

      reader.readAsText(file)
    }
  }

  useEffect(() => {
    setLoading(true)
    if (rowArray.length > 0) {
      const updatedTableRow = rowArray.map(user => {
        const attendance = user.days.map(userDetails => {
          if (userDetails.Status === 'P' && userDetails['Working Hrs.'] !== '0:00') {
            return { [userDetails.date]: 'P' }
          } else if (userDetails.Status === 'WO') {
            return { [userDetails.date]: 'WO' }
          } else {
            return { [userDetails.date]: 'A' }
          }
        })

        const userData = { id: user.id, employee: user.name }

        const mergeData = { ...userData, ...Object.assign({}, ...attendance) }

        return mergeData
      })
      setTableRows(updatedTableRow)
    }
    setLoading(false)
  }, [rowArray])

  const getUserSingleDateDetails = (params, user) => {
    let userDateDetails = {}
    rowArray.forEach(row => {
      if (row.id === params.row.id) {
        const data = row.days.find(val => {
          if (val?.date === user?.date) {
            return val
          }
        })

        userDateDetails = data
      }
    })

    return userDateDetails
  }

  const date = rowArray[0]?.days?.map(user => {
    return {
      field: user.date,
      headerName: user.date,
      width: 90,
      renderCell: params => {
        if (params.row[user.date] === 'P') {
          return (
            <Check
              className='checkIcon'
              onClick={() => {
                const userDateDetails = getUserSingleDateDetails(params, user)

                setIsOpen({ open: !isOpen.open, data: userDateDetails })
              }}
            />
          )
        } else if (params.row[user.date] === 'A') {
          return (
            <Close
              className='closeIcon'
              onClick={() => {
                const userDateDetails = getUserSingleDateDetails(params, user)

                setIsOpen({ open: !isOpen.open, data: userDateDetails })
              }}
            />
          )
        } else {
          return ''
        }
      }
    }
  })

  let totalColumns = [
    {
      field: 'employee',
      headerName: 'Employee',
      width: 150,
      editable: false
    }
  ]

  date?.map(val => {
    totalColumns.push(val)
  })

  return (
    <Box sx={{ width: '100%', display: 'flex', flexFlow: 'column' }}>
      <Box sx={{ marginBottom: '25px' }}>
        <CustomBreadcrumb title='Attendance' BreadcrumbTitle='Attendance'>
          <Input
            type='file'
            accept='.xlsx,.xls,.csv'
            sx={{ display: 'none' }}
            onChange={handleFileChange}
            id='file-input'
          />
          <InputLabel htmlFor='file-input'>
            <Button
              variant='contained'
              component='span'
              size='large'
              sx={{ minWidth: '200px' }}
              startIcon={<CloudUploadIcon />}
            >
              Upload File
            </Button>
          </InputLabel>
          {fileName && <Typography variant='body'>Selected File: {fileName}</Typography>}
        </CustomBreadcrumb>
      </Box>
      {loading ? <Loader /> : <CustomTable columns={totalColumns} rows={tableRows} />}
      {isOpen.open && <AttendanceModal isOpen={isOpen} setIsOpen={setIsOpen} handleCloseModal={handleCloseModal} />}
    </Box>
  )
}

export default AttendanceInfo
