import React, { useEffect, useState } from 'react'
import { CircleSmall } from 'mdi-material-ui'
import dayjs from 'dayjs'
import { calculateDateDifference } from '../../../../utils/helper'

const EmployeeExperienceDetails = ({ userData }) => {
  const [experienceDetails, setExperienceDetails] = useState([])
  useEffect(() => {
    if (userData?.experiences) {
      setExperienceDetails(userData?.experiences)
    }
  }, [userData?.experiences])

  return (
    <div className='experience-body'>
      {experienceDetails?.map(experience => (
        <div className='experience-content' key={experience.id}>
          <CircleSmall className='dot-icon' />
          <div>
            <span className='exprience-title'>
              {experience.companyName}
              <small className='exprience-title-jobPosition'> {experience.jobPosition}</small>
            </span>
            {experience.companyDOR ? (
              <div className='experience-time'>
                <span className='experience-desc'>
                  {`${dayjs(experience.companyDOJ).format('MMM YYYY')} -
                          ${dayjs(experience.companyDOR).format('MMM YYYY')}`}{' '}
                </span>
                <span className='experience-desc-range'>
                  {`${' '}${calculateDateDifference(experience.companyDOJ, experience.companyDOR)}`}
                </span>
              </div>
            ) : (
              <span className='experience-desc'>{`${dayjs(experience.companyDOJ).format('MMM YYYY')} - Present`}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default EmployeeExperienceDetails
