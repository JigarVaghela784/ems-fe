import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from 'mdi-material-ui/Menu'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { ACTIVITY, formattedTime, getOneDayTime } from '../../../../utils/helper'
import { useAttendanceStore } from '../../../store/attendance'
import Head from 'next/head'
import themeConfig from '../../../configs/themeConfig'
import { Axios } from 'api/axios'
import CustomToolTip from '../../../components/ToolTip'

const AppBarContent = props => {
  const { attendance = {} } = useAttendanceStore()
  const { activity = [] } = attendance || {}
  const { toggleNavVisibility } = props
  const [elapsedTime, setElapsedTime] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [startTime, setStartTime] = useState(null)


  useEffect(() => {
    if (activity.length > 0) {
      const timeVal = getOneDayTime(activity, ACTIVITY.PUNCH_IN, 'milliseconds', (time, diff) => {
        setStartTime(Date.now() - (time + diff))
        setTimerRunning(true)
      })
      if (activity[activity.length - 1].status === ACTIVITY.PUNCH_OUT) {
        setTimerRunning(false)
      }
      setElapsedTime(timeVal)
    }
  }, [activity])

  useEffect(() => {
    let interval
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime)
      }, 1000)
    } else {
      clearInterval(interval)
    }

    return () => {
      clearInterval(interval)
    }
  }, [timerRunning, startTime])

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Head>
        <title>
          {`${elapsedTime > 0 && timerRunning ? formattedTime(elapsedTime) : ''} ${themeConfig.templateName} - EMS`}{' '}
        </title>
      </Head>
      <div>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={toggleNavVisibility}
          sx={{ display: { lg: 'none' } }}
        >
          <Menu />
        </IconButton>
      </div>

      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/*<ModeToggler settings={settings} saveSettings={saveSettings} />*/}
        <UserDropdown isIconVisible />
      </Box>
    </Box>
  )
}

export default AppBarContent
