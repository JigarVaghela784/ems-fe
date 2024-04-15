import React from 'react'
import { CloseCircleOutline } from 'mdi-material-ui'
import { Grid } from '@mui/material'
import CustomInput from '../../../components/CustomInput'
import dayjs from 'dayjs'
import CustomDatePicker from '../../layouts/components/shared-components/CustomDatePicker'

const ExperienceList = ({ entry, handleRemoveEntry, handleChange }) => {
  const { id, companyName, jobPosition, companyDOJ, companyDOR } = entry || {}

  const handleDateChange = name => date => {
    const dateEvent = {
      target: {
        name: name,
        value: date.toISOString()
      }
    }
    handleChange(id)(dateEvent)
  }

  return (
    <div className='experience-list'>
      <div className='remove-icon' onClick={() => handleRemoveEntry(id)}>
        <CloseCircleOutline />
      </div>

      <Grid container spacing={7}>
        <Grid item xs={12} sm={6}>
          <CustomInput
            fullWidth
            name='companyName'
            label='Company Name'
            onChange={handleChange(id)}
            value={companyName || ''}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomInput
            fullWidth
            name='jobPosition'
            label='Job Position'
            onChange={handleChange(id)}
            placeholder='Job Position'
            value={jobPosition || ''}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomDatePicker
            sx={{ marginBottom: 3 }}
            label='Date of Joining'
            value={companyDOJ ? dayjs(companyDOJ) : null}
            onChange={handleDateChange('companyDOJ')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomDatePicker
            sx={{ marginBottom: 3 }}
            label='Date of Resigning'
            value={companyDOR ? dayjs(companyDOR) : null}
            onChange={handleDateChange('companyDOR')}
            minDate={dayjs(companyDOJ || new Date()).add(0, 'day')}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default ExperienceList
