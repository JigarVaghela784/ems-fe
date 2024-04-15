import React from 'react'
import { loginUrl } from 'utils/consts'
import { getCookie } from 'cookies-next'
import ProjectList from '../../@core/components/ProjectList'

const Project = () => {
  return <ProjectList />
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

export default Project
