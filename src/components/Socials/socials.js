import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import Facebook from 'mdi-material-ui/Facebook'
import Twitter from 'mdi-material-ui/Twitter'
import Github from 'mdi-material-ui/Github'
import Google from 'mdi-material-ui/Google'
import Box from '@mui/material/Box'
import React from 'react'

export const SocialsRenderer = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Link href='/' passHref>
        <IconButton component='a' onClick={e => e.preventDefault()}>
          <Facebook sx={{ color: '#497ce2' }} />
        </IconButton>
      </Link>
      <Link href='/' passHref>
        <IconButton component='a' onClick={e => e.preventDefault()}>
          <Twitter sx={{ color: '#1da1f2' }} />
        </IconButton>
      </Link>
      <Link href='/' passHref>
        <IconButton component='a' onClick={e => e.preventDefault()}>
          <Github sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300]) }} />
        </IconButton>
      </Link>
      <Link href='/' passHref>
        <IconButton component='a' onClick={e => e.preventDefault()}>
          <Google sx={{ color: '#db4437' }} />
        </IconButton>
      </Link>
    </Box>
  )
}
