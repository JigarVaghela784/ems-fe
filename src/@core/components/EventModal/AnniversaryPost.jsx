import React from 'react'
import WelcomePostImg from '../../../asset/image/WelcomePost.svg'
import Badge from '@mui/material/Badge'
import { Avatar } from '@mui/material'
import oneYear from '../../../asset/image/anniversary/1.svg'
import twoYear from '../../../asset/image/anniversary/2.svg'
import threeYear from '../../../asset/image/anniversary/3.svg'
import fourYear from '../../../asset/image/anniversary/4.svg'
import fiveYear from '../../../asset/image/anniversary/5.svg'
import sixYear from '../../../asset/image/anniversary/6.svg'
import sevenYear from '../../../asset/image/anniversary/7.svg'
import eightYear from '../../../asset/image/anniversary/8.svg'
import nineYear from '../../../asset/image/anniversary/9.svg'
import tenYear from '../../../asset/image/anniversary/10.svg'
import dayjs from 'dayjs'

const AnniversaryPost = ({ event }) => {
  const getYear = () => {
    const joining = dayjs(event?.joiningDate).startOf('day')
    switch (dayjs().endOf('day').diff(joining, 'year')) {
      case 1:
        return oneYear.src
      case 2:
        return twoYear.src
      case 3:
        return threeYear.src
      case 4:
        return fourYear.src
      case 5:
        return fiveYear.src
      case 6:
        return sixYear.src
      case 7:
        return sevenYear.src
      case 8:
        return eightYear.src
      case 9:
        return nineYear.src
      default:
        return tenYear.src
    }
  }

  return (
    <div className='card-bg-anniversary card-bg-modal' style={{ backgroundImage: `url(${getYear()})` }}>
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
          <div className='title'>{event.name}</div>
          <div className='title-2 '>{event.designation}</div>
        </div>
      </div>
    </div>
  )
}

export default AnniversaryPost
