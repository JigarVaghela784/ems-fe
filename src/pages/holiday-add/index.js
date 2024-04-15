import React from 'react'
import HolidaysInfo from '../../@core/components/Holidays/HolidaysInfo'
import { getCookie } from 'cookies-next'
import { loginUrl } from 'utils/consts'

const Holidays = () => {
  return <HolidaysInfo />
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

  return { props: {} }
}

export default Holidays
