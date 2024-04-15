import React from 'react'
import { loginUrl } from 'utils/consts'
import { getCookie } from 'cookies-next'
import ProjectDetails from '../../../@core/components/ProjectList/ProjectDetails'

const ProjectId = () => {
  return <ProjectDetails />
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

export default ProjectId
