import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import { Pencil } from 'mdi-material-ui'
import EmployeeExperienceDetails from './EmployeeExperienceDetails'
import UserExperience from '../EditEmployeeDetails/UserExperience'

const EmployeeExperience = ({ userData, handleUpdate }) => {
  const [showExperienceModal, setShowExperienceModal] = useState(null)

  return (
    <div className='experience-section'>
      <div className='header-section'>
        <div className='title'>Experience</div>
        <div>
          <IconButton
            size='small'
            aria-label='settings'
            className='card-more-options'
            sx={{ color: 'text.secondary' }}
            id='dropdown-settings'
            aria-haspopup='true'
            onClick={() => setShowExperienceModal(!showExperienceModal)}
            aria-controls='dropdown-settings'
          >
            <Pencil />
          </IconButton>
        </div>
      </div>
      <EmployeeExperienceDetails userData={userData} />

      <UserExperience
        open={showExperienceModal}
        setShowExperienceModal={setShowExperienceModal}
        handleSave={handleUpdate}
        userData={userData}
      />
    </div>
  )
}

export default EmployeeExperience
