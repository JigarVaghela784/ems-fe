import React from 'react'
import { CircleSmall, Close } from 'mdi-material-ui'
import cs from 'classnames'
import dayjs from 'dayjs'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import CustomSelect from '../../layouts/components/shared-components/CustomSelect'
import { ACTIVITY } from '../../../../utils/helper'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'

const TodaysActivityList = ({ item, editMode, activity, setActivity, index }) => {
  const handleChange = (value, name) => {
    const updatedActivity = activity.map((item, i) => {
      if (i === index) {
        if (name === 'status') {
          return { ...item, status: value }
        }

        return { ...item, time: dayjs(value).toISOString() }
      }

      return item
    })
    setActivity(updatedActivity)
  }

  const handleDelete = () => {
    const updatedActivity = activity.filter((item, i) => i !== index)
    setActivity(updatedActivity)
  }

  return (
    <div className={cs('activities', { ['editMode']: editMode })}>
      {editMode ? (
        <>
          <Tooltip title='Remove'>
            <IconButton>
              <Close className='icon cursor-pointer' style={{ fontSize: 14 }} onClick={handleDelete} />
            </IconButton>
          </Tooltip>
          <div className='activity-wrapper edit-activity-wrapper'>
            <CustomSelect
              size='small'
              title='Status'
              value={item.status}
              //onChange={e => setActivity({ ...activity, status: e.target.value })}
              onChange={({ target: { value } }) => handleChange(value, 'status')}
              options={[
                { value: ACTIVITY.PUNCH_IN, label: ACTIVITY.PUNCH_IN },
                { value: ACTIVITY.PUNCH_OUT, label: ACTIVITY.PUNCH_OUT }
              ]}
            />
            <div
              className={cs('time-picker', {
                'activity-time': item.status === ACTIVITY.PUNCH_IN,
                'activity-timeout': item.status !== ACTIVITY.PUNCH_IN
              })}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  value={dayjs(item.time)}
                  label='Time'
                  //onChange={newValue => setActivity({ ...activity, time: newValue })}
                  onChange={value => handleChange(value, 'time')}
                />
              </LocalizationProvider>

              {/*{dayjs(item.time).format('LT')}*/}
            </div>
          </div>
        </>
      ) : (
        <>
          <CircleSmall className='icon' />
          <div className='activity-wrapper'>
            <span className='activity-status'>{item.status}</span>
            <span
              className={cs({
                'activity-time': item.status === ACTIVITY.PUNCH_IN,
                'activity-timeout': item.status !== ACTIVITY.PUNCH_IN
              })}
            >
              {dayjs(item.time).format('LT')}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default TodaysActivityList
