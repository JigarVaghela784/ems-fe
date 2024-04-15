import React, { useMemo } from 'react'
import { Card } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AvatarGroup from '../../../../components/AvatarGroup'
import { DotsVertical } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import { getRoleMembers, stringToColor } from '../../../../../utils/helper'

const ProjectCard = ({ project }) => {
  const router = useRouter()
  const { name, description, id, employees } = project

  const roleMembers = useMemo(() => {
    return getRoleMembers(employees)
  }, [employees])

  const handleRedirect = () => {
    router.push({
      pathname: `/projects/${id}`
    })
  }

  return (
    <Card variant='outlined' sx={{ maxWidth: 345 }}>
      <CardHeader
        className='them-color card-heading'
        title={
          <div
            style={{ borderBottom: `4px solid ${stringToColor(name)}`, paddingBottom: 6, width: 'fit-content' }}
            className='d-flex'
          >
            <span style={{ width: 'fit-content' }}>{name}</span>
          </div>
        }
        onClick={() => handleRedirect()}
      />
      <CardContent>
        <Typography variant='body2' color='text.secondary' className='description-3-line'>
          {description}
        </Typography>
        {Object.keys(roleMembers).map(role => {
          const updateList = roleMembers[role].map(d => {
            return { ...d, name: d.employee.name }
          })

          return (
            <div key={role} className='mt-10'>
              <Typography className='them-color roleName'>{role.replace('_', ' ')} :</Typography>
              <AvatarGroup list={updateList} withLink />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default ProjectCard
