import React, { useEffect } from 'react'
import dayjs from 'dayjs'
import { getCookie } from 'cookies-next'
import { loginUrl } from '../../../utils/consts'
import Loader from 'src/components/Loader'
import { useAttendanceStore } from '../../store/attendance'
import UserAttendanceTable from '../../@core/components/UserAttendanceTable'
import { Axios } from '../../../api/axios'
import { useUserStore } from '../../store/user'
import { Container } from '@mui/material'
import CustomBreadcrumb from '../../@core/layouts/components/shared-components/CustomBreadcrumb'
import { getCurrentDate, getFormattedDate, startOfMonthDay } from '../../../utils/helper'

const EmployeeAttendance = ({}) => {
  const { attendanceLoading, setAttendanceList, setAttendanceLoading, setAttendance } = useAttendanceStore()
  const { user } = useUserStore()

  useEffect(() => {
    if (user.id) {
      const startDate = startOfMonthDay()
      const endDate = getCurrentDate()
      Axios.get(
        `attendance?userId=${user.id}&startDate=${getFormattedDate(startDate)}&endDate=${getFormattedDate(endDate)}`
      ).then(data => {
        const todayDate = getCurrentDate()
        const attendanceList = data?.attendanceList || []

        const userAttendance =
          attendanceList?.find(a => {
            return dayjs(todayDate).isSame(dayjs(a.date).format(), 'day')
          }) || {}
        setAttendance(userAttendance)
        setAttendanceList([...attendanceList])
        setAttendanceLoading(false)
      })
    }
  }, [user, setAttendance, setAttendanceList, setAttendanceLoading])

  return (
    <>
      {attendanceLoading ? (
        <Loader />
      ) : (
        <div className='attendance-wrapper'>
          <CustomBreadcrumb title='Attendance' BreadcrumbTitle='Attendance' />
          <Container>
            <UserAttendanceTable userId={user.id} />
          </Container>
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

export default EmployeeAttendance
