import React, { useMemo } from 'react'
import { percentage, stringToColor } from '../../../utils/helper'
import { Tooltip } from '@mui/material'
import Link from 'next/link'

const ProjectProgress = ({ projects = [] }) => {
  const totalHrs = useMemo(() => {
    let hrs = 0
    projects.forEach(p => {
      hrs += +p.hours
    })

    return hrs
  }, [projects])

  return (
    <div
      className='projectProgressWrapper'
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {projects.map(project => {
        return (
          <Link passHref href={`/projects/${project.projectId}`} key={project.projectId}>
            <Tooltip title={`${project.name}: ${project.hours} hrs`} placement='top'>
              <div
                className='cursor-pointer'
                style={{
                  width: `${percentage(project.hours, totalHrs) || 100}%`,
                  background: stringToColor(project.name)
                }}
              />
            </Tooltip>
          </Link>
        )
      })}
    </div>
  )
}

export default ProjectProgress
