import React from 'react'
import birthday from '../../../asset/image/birthda-bg.svg'
import Badge from '@mui/material/Badge'
import { Avatar } from '@mui/material'

const BirthdayCard = ({ event }) => {
  return (
    <div className='card-bg-birthday card-bg-modal' style={{ backgroundImage: `url(${birthday.src})` }}>
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
        <div>
          <div className='title pt-10'>{event.name}</div>
          <div className='title-2 '>{event.designation}</div>
        </div>
      </div>
    </div>
  )
}

export default BirthdayCard
