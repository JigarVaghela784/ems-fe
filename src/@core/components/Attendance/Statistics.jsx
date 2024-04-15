import { LinearProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAttendanceStore } from '../../../store/attendance'
import {
  ACTIVITY,
  getCurrentDate,
  getOneDayTime,
  subtractTime,
  totalOverTime,
  totalWorkingTime
} from '../../../../utils/helper'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useUserStore } from '../../../store/user'

dayjs.extend(isBetween)

const Statistics = () => {
  const { attendance, attendanceList, attendanceHoliday } = useAttendanceStore()
  const { user } = useUserStore()

  const statisticsInit = [
    {
      day: 'Today',
      time: 0,
      totalTime: 8,
      color: '#ff9b44',
      value: 0
    },
    {
      day: 'This Week',
      time: 0,
      totalTime: 40,
      color: '#ffbc34',
      value: 0
    },
    {
      day: 'This Month',
      time: 0,
      totalTime: 160,
      color: '#55ce63',
      value: 0
    },
    {
      day: 'Overtime',
      time: 0,
      color: '#009efb ',
      value: 0
    }
  ]
  const [statistics, setStatistics] = useState(statisticsInit)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    const { activity = [] } = attendance || {}
    const toDayTime = totalWorkingTime(activity)
    const time = parseInt(toDayTime.hr * 60 + toDayTime.min)

    //TODAY
    const dayTime = Math.floor(time / 60)

    //This Week
    let weekTime = 0

    const filterData = attendanceList.filter(d =>
      dayjs(d.date).isBetween(dayjs().startOf('week'), dayjs().endOf('week'))
    )
    filterData.forEach(listItem => {
      const toDayTime = totalWorkingTime(listItem?.activity)
      const time = parseInt(toDayTime.hr * 60 + toDayTime.min)
      const dayTime = time / 60
      weekTime += dayTime
    })
    weekTime = Math.floor(weekTime)

    //This Month
    let monthTime = 0
    attendanceList.forEach(listItem => {
      const toDayTime = totalWorkingTime(listItem?.activity)

      const time = parseInt(toDayTime.hr * 60 + toDayTime.min)
      const dayTime = time / 60
      monthTime += dayTime
    })
    monthTime = Math.floor(monthTime)

    //Monthly overTime
    let overTime = 0
    attendanceList.forEach(listItem => {
      const isWorkingDay = user?.workingDays?.includes(dayjs(new Date(listItem.date)).format('dddd'))

      const isHoliday = attendanceHoliday.find(
        a => dayjs(a.date).format('D-M-YYYY') === dayjs(getCurrentDate(listItem.date)).format('D-M-YYYY')
      )
      const workingTimeTotal = getOneDayTime(listItem?.activity, ACTIVITY.PUNCH_IN)
      const { hr, min } = totalOverTime(listItem?.activity, subtractTime(user.workingHours, user.break))
      const overTimeTotal = hr * 60 + min
      overTime += !isWorkingDay || isHoliday ? workingTimeTotal : overTimeTotal
    })

    const updateVal = statistics.map(s => {
      const todayTime = user?.workingHours || 8
      const weekTotalTime = todayTime * user?.workingDays?.length || 5
      const monthTotalTime = weekTotalTime * 4

      switch (s.day) {
        case 'Today':
          return { ...s, time: dayTime, value: (100 * dayTime) / s.totalTime, totalTime: todayTime }
        case 'This Week':
          return { ...s, time: weekTime, value: (100 * weekTime) / s.totalTime, totalTime: weekTotalTime }
        case 'This Month':
          return { ...s, time: monthTime, value: (100 * monthTime) / s.totalTime, totalTime: monthTotalTime }
        case 'Overtime':
          return { ...s, time: (overTime / 60).toFixed(0), value: (100 * (overTime / 60)) / 60 }
        default:
          return { ...s }
      }
    })
    setStatistics(updateVal)
  }, [attendance, timer, user?.workingHours, user?.workingDays?.length, attendanceList])

  useEffect(() => {
    const ref = setInterval(() => {
      setTimer(prevState => prevState + 1)
    }, 20000)

    return () => {
      clearInterval(ref)
    }
  }, [])

  return (
    <div className='block-wrapper'>
      <div className='title'>Statistics</div>
      {statistics.map((statistic, i) => (
        <div className='progress-loader' key={i}>
          <div className='progress-title'>
            <span className='progress-day'>{statistic.day}</span>
            <span className='progress-time'>
              {statistic.time} {statistic.totalTime && `/ ${statistic.totalTime}`} hrs
            </span>
          </div>
          <LinearProgress
            sx={{
              '& .MuiLinearProgress-bar': {
                backgroundColor: statistic.color
              }
            }}
            variant='determinate'
            value={statistic.value >= 100 ? 100 : statistic.value}
          />
        </div>
      ))}
    </div>
  )
}

export default Statistics
