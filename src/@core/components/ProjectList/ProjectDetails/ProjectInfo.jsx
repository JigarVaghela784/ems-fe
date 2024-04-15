import { Card, CardContent, CardHeader } from '@mui/material'
import React from 'react'
import { stringToColor } from '../../../../../utils/helper'

export const ProjectInfo = ({ project = {} }) => {
  const { name = '', description = '' } = project

  return (
    <Card variant='outlined'>
      <CardHeader
        className='them-color'
        title={
          <div
            style={{ borderBottom: `4px solid ${stringToColor(name)}`, paddingBottom: 6, width: 'fit-content' }}
            className='d-flex'
          >
            <span style={{ width: 'fit-content' }}>{name}</span>
          </div>
        }
      />
      <CardContent className='them-color'>{description}</CardContent>
    </Card>
  )
}
