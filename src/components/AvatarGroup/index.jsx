import React from 'react'
import Avatar from '@mui/material/Avatar'
import { stringAvatar } from '../../../utils/helper'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Link from 'next/link'

const AvatarGroup = ({ list, withLink }) => {
  return (
    <Stack direction='row' spacing={-1} className='avatar-list'>
      {list.map((user, index) =>
        withLink ? (
          <Link key={index} passHref href={`/employee-profile?userId=${user.employeeId}`}>
            <Tooltip title={user?.name || ''} placement='top'>
              <Avatar {...stringAvatar(user?.name)} src={user?.employee?.profile} />
            </Tooltip>
          </Link>
        ) : (
          <div key={index}>
            <Tooltip title={user?.name || ''} placement='top'>
              <Avatar {...stringAvatar(user?.name)} src={user?.employee?.profile} />
            </Tooltip>
          </div>
        )
      )}
    </Stack>
  )
}

export default AvatarGroup
