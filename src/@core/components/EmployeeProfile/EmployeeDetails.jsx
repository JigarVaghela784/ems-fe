import React, { useEffect, useMemo, useState } from 'react'
import Badge from '@mui/material/Badge'
import BadgeContentSpan from '../BadgeContentSpan'
import { getFormattedDate, getStatusColor } from '../../../../utils/helper'
import { Avatar, IconButton } from '@mui/material'
import dayjs from 'dayjs'
import { Pencil } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import EditEmployeeProfile from '../EditEmployeeDetails/EditEmployeeProfile'
import ProjectProgress from '../../../components/ProjectProgress'

const EmployeeDetails = ({ userData, handleSave, isAccessToEdit }) => {
  const router = useRouter()
  const { userId } = router.query
  const [profileAvatar, setProfileAvatar] = useState('')
  const [editProfileModal, setEditProfileModal] = useState(null)

  const {
    joiningDate,
    email,
    id,
    name,
    phone = '',
    dob = '',
    address = '',
    gender = '',
    designation = '',
    employeeStatus = '',
    workingHours,
    profile,
    workingDays = [],
    projects = []
  } = userData

  useEffect(() => {
    if (userData.avatar) {
      setProfileAvatar(userData.avatar[0].url)
    }
  }, [userData])

  const project = useMemo(() => {
    return projects.reduce((acc, current) => {
      if (!current.delete) {
        const existObj = acc.find(item => {
          return item.projectId === current.projectId && item.employeeId === current.employeeId
        })
        if (existObj) {
          existObj.hours = (+existObj.hours + +current.hours).toString()
        } else {
          acc.push(current)
        }
      }

      return acc
    }, [])
  }, [projects])

  return (
    <div className='profile-section'>
      <div className='user-profile'>
        <div className='profile-user-wrapper'>
          <Badge
            overlap='circular'
            badgeContent={<BadgeContentSpan style={{ background: getStatusColor(employeeStatus) }} />}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Avatar className='profile-user-image' alt='Profile Image' src={profile ?? profileAvatar} />
          </Badge>
        </div>
        <div className='details'>
          <div className='details-section'>
            <span className='profile-title'>{name}</span>
            <span className='profile-description'>{designation}</span>
          </div>
          <div className='details-section'>
            <span className='profile-description'>
              {joiningDate && `Date of Joining : ${getFormattedDate(joiningDate, 'DD MMM YYYY')}`}
            </span>
            <span className='profile-description'>
              {workingHours && `Daily Working hours : ${workingHours}hrs / day`}
            </span>
            <span className='profile-description'>
              {workingDays.length && `Working days : ${workingDays.length} days per week`}
            </span>
          </div>
          {projects.length > 0 && (
            <div style={{ width: 'calc(100% - 75px)' }}>
              <div className='details-section'>
                <span className='profile-employeeID'>Projects</span>
              </div>
              <ProjectProgress projects={project} />
            </div>
          )}
        </div>
      </div>
      <div className='user-data'>
        <div className='edit-profile-button'>
          <div className='user-data-title'>User Details</div>
          {isAccessToEdit && (
            <IconButton
              size='small'
              aria-label='settings'
              className='card-more-options edit-icon'
              sx={{ color: 'text.secondary' }}
              id='dropdown-settings'
              aria-haspopup='true'
              onClick={() => setEditProfileModal(!editProfileModal)}
              aria-controls='dropdown-settings'
              aria-expanded={editProfileModal ? 'true' : undefined}
            >
              <Pencil />
            </IconButton>
          )}
        </div>
        <div className='user-data-wrapper'>
          <span className='user-data-title'>Phone :</span>
          <span className='user-data-details'>{phone ? phone : '-'}</span>
        </div>
        <div className='user-data-wrapper'>
          <span className='user-data-title'>Email :</span>
          <span className='user-data-details'>{email ? email : '-'}</span>
        </div>
        <div className='user-data-wrapper'>
          <span className='user-data-title'>Birthday :</span>
          <span className='user-data-details'>{dob ? getFormattedDate(dob, 'D MMM YYYY') : ''}</span>
        </div>
        <div className='user-data-wrapper'>
          <span className='user-data-title'>Address :</span>
          <span className='user-data-details'>{address ? address : '-'}</span>
        </div>
        <div className='user-data-wrapper'>
          <span className='user-data-title'>Gender :</span>
          <span className='user-data-details'>{gender ? gender : '-'}</span>
        </div>
      </div>

      <EditEmployeeProfile
        open={editProfileModal}
        userData={userData}
        setEditProfileModal={setEditProfileModal}
        handleSave={handleSave}
        profileAvatar={profileAvatar}
      />
    </div>
  )
}

export default EmployeeDetails
