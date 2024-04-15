import React, { useEffect, useMemo, useState } from 'react'
import { Box, FormControl } from '@mui/material'
import TimesheetTable from '../Attendance/TimesheetTable'
import { useAttendanceStore } from '../../../store/attendance'
import dayjs from 'dayjs'
import {
  ACTIVITY,
  calculateTotalTime,
  getCurrentDate,
  getFormattedDate,
  getOneDayTime,
  startOfMonthDay,
  subtractTime,
  totalBreakTime,
  totalOverTime,
  totalWorkingTime
} from '../../../../utils/helper'
import { Axios } from 'api/axios'
import Loader from 'src/components/Loader'
import cs from 'classnames'
import { useUserStore } from 'src/store/user'
import CustomDatePicker from '../../layouts/components/shared-components/CustomDatePicker'
import { useRouter } from 'next/router'

const UserAttendanceTable = ({ userId, userData }) => {
  const { attendanceList, setAttendanceList, setAttendanceHoliday, attendanceHoliday, leave, setLeave } =
    useAttendanceStore()
  const { user: loginUser } = useUserStore()
  const user = userData || loginUser
  const [loading, setLoading] = useState()
  const startDate = startOfMonthDay()
  const endDate = getCurrentDate()
  const router = useRouter()
  const { pathname, query } = router
  const { from, to } = query
  const fromStartDate = from ? from : ''
  const toEndDate = to ? to : ''

  const fromDate = fromStartDate || startDate
  const toDate = toEndDate || endDate

  const [searchData, setSearchData] = useState({
    from: fromDate,
    to: toDate
  })

  const tableRows = useMemo(() => {
    if (!attendanceList.length) return []

    return attendanceList.map(data => {
      const date = data.date
      const isWorkingDay = user?.workingDays?.includes(dayjs(date).format('dddd'))

      const isHoliday = attendanceHoliday.find(item => {
        return dayjs(item.date).format('MM-DD-YYYY') === dayjs(date).format('MM-DD-YYYY')
      })
      const { hr: breakHR, min: breakMin } = totalBreakTime(data.activity)

      const { hr: overTimeHR, min: overTimeMin } = totalOverTime(
        data.activity,
        subtractTime(user.workingHours, user.break)
      )
      const { hr: workingHR, min: workingMin } = totalWorkingTime(data.activity)
      const time = getOneDayTime(data.activity, ACTIVITY.PUNCH_IN)

      const hr = parseInt(time / 60)
      const min = dayjs().minute(time).$m

      const productionTime = hr || min ? `${hr} hrs ${min} mins` : '-'
      const workingTime = workingHR || workingMin ? `${workingHR} hrs ${workingMin} mins` : '-'

      return {
        ...data,
        punchIn: dayjs(data.activity[0]?.time).format('hh:mm A'),
        punchOut:
          data.activity[data.activity.length - 1]?.status === ACTIVITY.PUNCH_OUT
            ? dayjs(data.activity[data.activity.length - 1].time).format('hh:mm A')
            : '-',
        production: productionTime,
        break: breakHR || breakMin ? `${breakHR} hrs ${breakMin} mins` : '-',
        overTime:
          !isWorkingDay || isHoliday
            ? productionTime
            : overTimeHR || overTimeMin
            ? `${overTimeHR} hrs ${overTimeMin} mins`
            : '-',
        workingTime: workingTime
      }
    })
  }, [attendanceList, attendanceHoliday])

  const [filterData, setFilterData] = useState([])

  useEffect(() => {
    setFilterData(tableRows)
  }, [tableRows])

  const handleDateChange = (name, value) => {
    setSearchData({ ...searchData, [name]: value ? value.toISOString() : null })
  }

  useEffect(() => {
    const params = { ...query }
    if (searchData.from) {
      params.from = getFormattedDate(searchData.from)
    }

    if (searchData.to) {
      params.to = getFormattedDate(searchData.to)
    }

    router.push(
      {
        pathname,
        query: { ...params }
      },
      undefined,
      {
        shallow: true
      }
    )
  }, [searchData.from, searchData.to])

  useEffect(() => {
    if (searchData.from && searchData.to) {
      setLoading(true)

      const startDate = searchData.from
      const endDate = searchData.to

      Axios.get(
        `attendance?userId=${userId}&startDate=${getFormattedDate(startDate)}&endDate=${getFormattedDate(endDate)}`
      )
        .then(data => {
          const attendanceList = data?.attendanceList || []
          setAttendanceList(attendanceList)
          setAttendanceHoliday(data.holidays)
          setLeave(data?.totalLeaves)
          setLoading(false)
        })
        .catch(error => {
          console.log(error)
          setLoading(false)
        })
    }
  }, [searchData])

  useEffect(() => {
    if (userId) {
      setLoading(true)

      const startDate = searchData.from
      const endDate = searchData.to
      Axios.get(
        `attendance?userId=${userId}&startDate=${getFormattedDate(startDate)}&endDate=${getFormattedDate(endDate)}`
      )
        .then(data => {
          const attendanceList = data?.attendanceList || []
          setAttendanceList([...attendanceList])
          setAttendanceHoliday(data.holidays)
          setLeave(data?.totalLeaves)
        })
        .finally(() => setLoading(false))
    }
  }, [userId])

  return (
    <div className={cs('p-24 mt-24', { 'attendance-section-wrapper': userId })}>
      <div className='search-bar-employees scrollbar-css'>
        <FormControl>
          <Box>
            <CustomDatePicker
              label='From'
              value={searchData.from ? dayjs(searchData.from) : null}
              onChange={newValue => handleDateChange('from', newValue)}
            />
          </Box>
        </FormControl>
        <FormControl>
          <Box>
            <CustomDatePicker
              label='To'
              value={searchData.to ? dayjs(searchData.to) : null}
              onChange={newValue => handleDateChange('to', newValue)}
            />
          </Box>
        </FormControl>
      </div>
      {loading ? <Loader /> : <TimesheetTable tableRows={filterData} />}
      <div className='total-time-wrapper'>
        <span className='title-wrapper'>
          Production Hours: <span className='time-wrapper'>{calculateTotalTime(tableRows, 'workingTime')}</span>
        </span>
        <span className='title-wrapper'>
          Working Hours: <span className='time-wrapper'>{calculateTotalTime(tableRows, 'production')}</span>
        </span>
        <span className='title-wrapper'>
          Break Hours: <span className='time-wrapper'>{calculateTotalTime(tableRows, 'break')}</span>
        </span>
        <span className='title-wrapper'>
          Overtime: <span className='time-wrapper'>{calculateTotalTime(tableRows, 'overTime')}</span>
        </span>
        {leave > 0 && (
          <span className='title-wrapper'>
            Leaves: <span className='leaves-wrapper'>{leave}</span>
          </span>
        )}
      </div>
    </div>
  )
}

export default UserAttendanceTable
