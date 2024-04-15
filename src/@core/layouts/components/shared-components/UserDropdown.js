// ** React Imports
import React, { useState, Fragment, useMemo } from 'react'
import { deleteCookie } from 'cookies-next'
import { accountProfileUrl, loginUrl } from 'utils/consts'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import { useUserStore } from '../../../../store/user'
import BadgeContentSpan from '../../../components/BadgeContentSpan'
import { setCookiesOptions } from '../../../../../utils/helper'

const UserDropdown = ({ isHidden, isIconVisible }) => {
  // ** States
  const [anchorEl, setAnchorEl] = useState(null)
  const { user: data } = useUserStore()

  // ** Hooks
  const router = useRouter()

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
      if (url === loginUrl) {
        deleteCookie('user')
        const options = setCookiesOptions()
        deleteCookie('token', options)
      }
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  const userImage = useMemo(() => {
    if (data?.profile) {
      return data?.profile
    }

    return '/images/avatars/1.png'
  }, [data])

  return (
    <Fragment>
      <div onClick={handleDropdownOpen} className='d-flex cursor-pointer'>
        <Avatar alt='John Doe' onClick={handleDropdownOpen} sx={{ width: 40, height: 40 }} src={userImage} />
        <div className={isIconVisible ? 'user-dropdown' : ''}>
          <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600, width: 'max-content' }} className={isHidden ? 'user-text' : ''}>
              {data?.name || 'User'}
            </Typography>
            <Typography
              variant='body2'
              sx={{ fontSize: '0.8rem', color: 'text.disabled', textTransform: 'capitalize', width: 'max-content' }}
              className={isHidden ? 'user-text' : ''}
            >
              {data?.role?.replace('_', ' ')}
            </Typography>
          </Box>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {/*<Box sx={{ pt: 2, pb: 3, px: 4 }}>*/}
        {/*  <Box sx={{ display: 'flex', alignItems: 'center' }}>*/}
        {/*    <Badge*/}
        {/*      overlap='circular'*/}
        {/*      badgeContent={<BadgeContentSpan />}*/}
        {/*      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}*/}
        {/*    >*/}
        {/*      <Avatar alt='John Doe' src={userImage} sx={{ width: '2.5rem', height: '2.5rem' }} />*/}
        {/*    </Badge>*/}
        {/*    <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>*/}
        {/*      <Typography sx={{ fontWeight: 600 }}>{data?.name || 'User'}</Typography>*/}
        {/*      <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>*/}
        {/*        {data?.role}*/}
        {/*      </Typography>*/}
        {/*    </Box>*/}
        {/*  </Box>*/}
        {/*</Box>*/}
        {/*<Divider sx={{ mt: 0, mb: 1 }} />*/}
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose(accountProfileUrl)}>
          <Box sx={styles}>
            <AccountOutline sx={{ marginRight: 2 }} />
            Profile
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 2 }} onClick={() => handleDropdownClose(loginUrl)}>
          <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
