import React from 'react'
import Badge from '@mui/material/Badge'
import { Avatar } from '@mui/material'
import WelcomePostImg from '../../../asset/image/WELCOME.svg'
import dayjs from 'dayjs'

const WelcomePost = ({ event }) => {
  return (
    <div className='card-bg-welcome card-bg-modal' style={{ backgroundImage: `url(${WelcomePostImg.src})` }}>
      <div className='user-card-div' style={{ backgroundColor: '#ffffff00', border: 0, boxShadow: 'none' }}>
        <div className='profile-wrapper events-profile-wrapper'>
          <Badge
            overlap='circular'
            sx={{ ml: 2, cursor: 'pointer' }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar
              className='profile-image events-user-image'
              alt='Flora'
              src={event?.profile ? event?.profile : '/images/avatars/1.png'}
            />
          </Badge>
        </div>
        <div className='names'>
          <div className='welcome-title'>{event.name}</div>
          <div className='welcome-designation'>{event.designation}</div>
          <div className='welcome-date'>{dayjs(event.joiningDate).format('DD MMMM, YYYY | dddd')}</div>
        </div>
      </div>
    </div>
  )
}

export default WelcomePost
