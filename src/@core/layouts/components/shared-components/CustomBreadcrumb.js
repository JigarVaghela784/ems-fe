import React from 'react'
import { Breadcrumbs, Container, Typography } from '@mui/material'
import Link from 'next/link'

const CustomBreadcrumb = ({ title, extraLink, BreadcrumbTitle, children }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Container>
        <Typography variant='h5'>{title}</Typography>
        <div role='presentation'>
          <Breadcrumbs aria-label='breadcrumb'>
            <Link href='/'>Dashboard</Link>
            {extraLink && extraLink}
            <Typography color='text.primary'>{BreadcrumbTitle}</Typography>
          </Breadcrumbs>
        </div>
      </Container>
      <Container sx={{ textAlign: 'right' }}>{children}</Container>
    </div>
  )
}

export default CustomBreadcrumb
