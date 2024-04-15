import React from 'react'
import { getCookie } from 'cookies-next'
import { loginUrl } from '../../../utils/consts'
import AttendanceAdminTable from '../../@core/components/Attendance/AttendanceInfo/AttendanceAdminTable'

const Attendance = () => {
  return (
    <>
      {/*<AttendanceInfo />*/}
      <AttendanceAdminTable />
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

export default Attendance
