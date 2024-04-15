import React, { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import { loginUrl } from 'utils/consts'
import { useAttendanceStore } from '../store/attendance'
import { useUserStore } from '../store/user'
import { Axios } from '../../api/axios'
import dayjs from 'dayjs'
import Loader from '../components/Loader'
import Timesheet from '../@core/components/Attendance/Timesheet'
import { useHolidaysStore } from '../store/holidays'
import { dayStartDate, getCurrentDate, getFormattedDate, next30Day, startOfMonthDay } from '../../utils/helper'

const Dashboard = () => {
  const { attendanceLoading, setAttendanceList, setAttendanceLoading, setAttendance, setAttendanceHoliday } =
    useAttendanceStore()
  const { user } = useUserStore()
  const { upcomingHolidayLoading, setUpcomingHolidayLoading, setUpcomingHoliday } = useHolidaysStore()

  useEffect(() => {
    if (user.id) {
      const startDateAttendance = startOfMonthDay()
      const endDateAttendance = getCurrentDate()
      Axios.get(
        `attendance?userId=${user.id}&startDate=${getFormattedDate(startDateAttendance)}&endDate=${getFormattedDate(
          endDateAttendance
        )}`
      ).then(data => {
        const todayDate = getCurrentDate()
        const attendanceList = data?.attendanceList || []

        const userAttendance =
          attendanceList?.find(a => {
            return dayjs(todayDate).isSame(dayjs(a.date).format(), 'day')
          }) || {}
        setAttendance(userAttendance)
        setAttendanceList([...attendanceList])
        setAttendanceHoliday(data?.holidays)
        setAttendanceLoading(false)
      })

      setUpcomingHolidayLoading(true)

      const startDate = dayStartDate()
      const endDate = next30Day()
      Axios.get(`holidays/upcoming?startDate=${getFormattedDate(startDate)}&endDate=${getFormattedDate(endDate)}`)
        .then(upcomingHoliday => {
          setUpcomingHoliday(upcomingHoliday)
        })
        .catch(e => {
          console.log('Error: holidays/upcoming', e)
        })
        .finally(() => {
          setUpcomingHolidayLoading(false)
        })
    }
  }, [user])

  return (
    <>
      {attendanceLoading || upcomingHolidayLoading ? (
        <Loader />
      ) : (
        <div className='page-center'>
          <Timesheet />
        </div>
      )}
    </>
  )
}

export async function getServerSideProps(props) {
  const id = getCookie('token', props)
  if (!id) {
    return {
      redirect: {
        destination: loginUrl
      }
    }
  }

  return {
    props: {}
  }
}

export default Dashboard
