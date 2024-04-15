import React from 'react'
import LeavesAdminInfo from '../../@core/components/Leaves/LeavesInfo'
import { loginUrl } from 'utils/consts'
import { getCookie } from 'cookies-next'

const Leaves = () => {
  return <LeavesAdminInfo />
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

export default Leaves
