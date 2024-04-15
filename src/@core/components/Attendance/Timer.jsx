import React, { useEffect, useMemo, useState } from 'react'
import CustomButton from '../../layouts/components/shared-components/CustomButton'
import dayjs from 'dayjs'
import cs from 'classnames'
import utc from 'dayjs/plugin/utc'
import { ACTIVITY, formattedTime, getCurrentDate, getOneDayTime } from '../../../../utils/helper'
import { Axios } from '../../../../api/axios'
import { useAttendanceStore } from '../../../store/attendance'
import { toast } from 'react-toastify'
import { useUserStore } from '../../../store/user'

dayjs.extend(utc)

const Timer = ({ userDetails, isPreview, activity = [] }) => {
  const { attendanceList, attendance = {}, setAttendanceList, setAttendance } = useAttendanceStore()
  const { user: loginUser } = useUserStore()
  const user = userDetails || loginUser
  const [timerRunning, setTimerRunning] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const isPunchIn = activity.length > 0 ? activity?.length % 2 === 0 : true

  // Get first time user info
  useEffect(() => {
    if (activity.length > 0) {
      const timeVal = getOneDayTime(activity, ACTIVITY.PUNCH_IN, 'milliseconds', (time, diff) => {
        setStartTime(Date.now() - (time + diff))
        setTimerRunning(true)
      })
      setElapsedTime(timeVal)
    } else {
      setElapsedTime(0)
    }
  }, [activity])

  const remainingTime = useMemo(() => {
    const workingHours = user.workingHours
    const breakTime = user.break
    const remainingMilliseconds = (workingHours - breakTime) * 60 * 60 * 1000 - elapsedTime
    if (remainingMilliseconds <= 0) {
      return 0
    } else {
      return remainingMilliseconds
    }
  }, [elapsedTime, user])

  const handlePunch = async () => {
    const currentTime = dayjs().format('ddd, D MMM YYYY h:mm:ss A')
    const currentStatus = isPunchIn ? ACTIVITY.PUNCH_IN : ACTIVITY.PUNCH_OUT
    try {
      if (!Object.keys(attendance).length) {
        const resp = await Axios.post(`attendance`, {
          date: getCurrentDate(),
          activity: [
            {
              status: currentStatus,
              time: getCurrentDate()
            }
          ]
        })
        await setAttendanceList([...attendanceList, resp])
        await setAttendance(resp)
      } else {
        const activityUpdateVal = [...attendance.activity, { time: getCurrentDate(), status: currentStatus }]

        const resp = await Axios.patch(`attendance/${attendance.id}`, {
          activity: activityUpdateVal
        })

        const updateListArray = attendanceList.map(a =>
          a.id === attendance.id ? { ...a, activity: activityUpdateVal } : a
        )
        await setAttendanceList(updateListArray)
        await setAttendance({ ...attendance, activity: activityUpdateVal })
      }
      if (isPunchIn) {
        setStartTime(Date.now() - elapsedTime)
        setTimerRunning(true)
      } else {
        setTimerRunning(false)
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
    }
  }

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
    <div className='punching-block'>
      <div className='punch-hours'>
        <span
          style={{
            fontWeight: 700
          }}
        >
          {formattedTime(elapsedTime)}
        </span>
        <span
          className={cs('remaining-time', {
            ['null-remaining-time']: !remainingTime
          })}
        >
          {formattedTime(remainingTime)}
        </span>
      </div>
      {!isPreview && (
        <CustomButton
          onClick={handlePunch}
          style={{
            width: '150px'
          }}
          fullWidth={false}
        >
          {isPunchIn ? ACTIVITY.PUNCH_IN : ACTIVITY.PUNCH_OUT}
        </CustomButton>
      )}
    </div>
  )
}

export default Timer
