import React, { useEffect, useMemo, useState } from 'react'
import CustomSelect from '../../../layouts/components/shared-components/CustomSelect'
import { Badge, Box, IconButton, Tooltip } from '@mui/material'
import { customHandleChange } from '../helper'
import dayjs from 'dayjs'
import { Close } from 'mdi-material-ui'
import CustomInput from '../../../../components/CustomInput'
import CustomDatePicker from '../../../layouts/components/shared-components/CustomDatePicker'
import { getFormattedDate } from 'utils/helper'

const SearchLeave = ({ searchData, setSearchData, isEmployee, searchEmployeeData, setIsChangeFilter }) => {
  const [showLeave, setShowLeave] = useState(false)

  const leaveTypeOptions = [
    { name: '-- Select --', value: '' },
    { name: 'Casual Leave', value: 'Casual Leave' },
    { name: 'Medical Leave', value: 'Medical Leave' },
    { name: 'Loss of Pay', value: 'Loss of Pay' }
  ]

  const handleReset = () => {
    setSearchData({
      employeeName: '',
      leaveType: '',
      fromStartDate: null,
      toEndDate: null
    })
  }

  const handleDateChange = (name, value) => {
    setSearchData({ ...searchData, [name]: value ? getFormattedDate(value) : null })
  }

  const handleClearAll = () => {
    handleReset()
    setShowLeave(false)
  }

  useEffect(() => {
    const hasEmployeeName = !!searchData.employeeName
    const hasLeaveType = !!searchData.leaveType
    const hasFromDate = !!searchData.fromStartDate
    const hasEndDate = !!searchData.toEndDate
    setShowLeave(hasEmployeeName || hasLeaveType || hasFromDate || hasEndDate)
  }, [searchData.employeeName, searchData.leaveType, searchData.fromStartDate, searchData.toEndDate])

  const handleClear = searchKey => {
    const updatedSearchData = { ...searchData }
    delete updatedSearchData[searchKey]
    if (searchKey === 'employeeName') {
      updatedSearchData[searchKey] = ''
    }

    setSearchData(updatedSearchData)
    const searchObj = {}
    Object.keys(updatedSearchData).map(k => {
      if (updatedSearchData[k]) searchObj[k] = updatedSearchData[k]
    })

    setShowLeave(Object.values(searchObj).some(item => item !== null))
  }

  const newSearchData = useMemo(() => {
    return Object.keys(searchEmployeeData).map(key => {
      if (key === 'from' || key === 'to') {
        searchEmployeeData[key] = dayjs(searchEmployeeData[key]).format('DD-MM-YYYY')
      }

      return {
        key: key,
        value: searchEmployeeData[key],
        type: ['fromStartDate', 'toEndDate'].includes(key) ? 'date' : 'text'
      }
    })
  }, [searchEmployeeData])

  return (
    <>
      <Box
        display='grid'
        gridTemplateColumns={!isEmployee ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)'}
        gap={5}
        sx={{ marginBottom: '20px', mt: '10px' }}
        className='leave-search scrollbar-css'
      >
        {!isEmployee && (
          <Box>
            <CustomInput
              fullWidth
              id='employeeName'
              label='Employee Name'
              autoComplete='off'
              value={searchData.employeeName}
              onChange={e => {
                setIsChangeFilter(true)
                e.target.value === '' ? setShowLeave(false) : setShowLeave(true)
                setSearchData(customHandleChange(searchData, 'employeeName', e.target.value))
              }}
            />
          </Box>
        )}
        <Box>
          <CustomSelect
            title='Leave Type'
            id='leaveType'
            options={leaveTypeOptions}
            value={searchData.leaveType}
            handleChange={e => {
              setIsChangeFilter(true)
              e.target.value === '' ? setShowLeave(false) : setShowLeave(true)
              setSearchData(customHandleChange(searchData, 'leaveType', e.target.value))
            }}
          />
        </Box>
        <Box>
          <CustomDatePicker
            label='From'
            value={searchData.fromStartDate ? dayjs(searchData.fromStartDate) : null}
            onChange={newValue => {
              setIsChangeFilter(true)
              !newValue ? setShowLeave(false) : setShowLeave(true)
              handleDateChange('fromStartDate', newValue)
            }}
          />
        </Box>
        <Box>
          <CustomDatePicker
            label='To'
            value={searchData.toEndDate ? dayjs(searchData.toEndDate) : null}
            onChange={newValue => {
              setIsChangeFilter(true)
              !newValue ? setShowLeave(false) : setShowLeave(true)
              handleDateChange('toEndDate', newValue)
            }}
            minDate={searchData.fromStartDate ? dayjs(searchData.fromStartDate).add(1, 'day') : null}
          />
        </Box>
      </Box>
      {showLeave && (
        <Box sx={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
          <Box>
            {newSearchData
              .filter(item => item.value)
              .map((d, index) => (
                <Badge className='badgeContent' key={index}>
                  <span>{d.type === 'date' ? dayjs(d.value).format('DD-MM-YYYY') : d.value}</span>
                  <IconButton>
                    <Close className='badgeCloseIcon' onClick={() => handleClear(d.key)} />
                  </IconButton>
                </Badge>
              ))}
          </Box>
          <Tooltip title='Clear' placement='top'>
            <IconButton className='btnClear' onClick={handleClearAll}>
              <Close className='closeIcon' />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </>
  )
}

export default SearchLeave
