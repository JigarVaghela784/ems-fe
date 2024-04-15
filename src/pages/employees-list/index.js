import React from 'react'
import { loginUrl } from 'utils/consts'
import { getCookie } from 'cookies-next'
import EmployeesList from '../../@core/components/EmployeesList'

const Employees = () => {
  return <EmployeesList viewOnly />
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

export default Employees
