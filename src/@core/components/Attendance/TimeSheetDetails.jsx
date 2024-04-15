import React from 'react'
import dayjs from 'dayjs'
import Timer from './Timer'
import { ACTIVITY } from '../../../../utils/helper'

const TimeSheetDetails = ({ userDetails, date, totalBreak, totalOverTimeMinutes, activity, isPreview, isClose }) => {
  return (
    <div className='block-wrapper timeSheetDetailsBlock'>
      <div className='title'>
        Timesheet
        <span>{dayjs(date).format('DD MMM')}</span>
      </div>
      {isPreview && !isClose && (
        <div className='inner-block'>
          <span className='small-text'>{ACTIVITY.PUNCH_IN} at</span>
          <span className='medium-text'>
            {activity.length > 0 ? dayjs(activity[0].time).format('ddd, D MMM YYYY h:mm:ss A') : ''}
          </span>
        </div>
      )}

      {((isPreview && activity.length > 0 && activity.length % 2 === 0) || !isPreview) && (
        <div className='inner-block'>
          <span className='small-text'>
            {activity.length > 0 && activity.length % 2 === 0 ? ACTIVITY.PUNCH_OUT : ACTIVITY.PUNCH_IN} at
          </span>
          <span className='medium-text'>
            {activity.length > 0 ? dayjs(activity[activity.length - 1].time).format('ddd, D MMM YYYY h:mm:ss A') : ''}
          </span>
        </div>
      )}

      <Timer userDetails={userDetails} isPreview={isPreview} activity={activity} />

      <div className='lower-blocks'>
        <div className='inner-block'>
          <span className='small-text-lower'>Break</span>
          {totalBreak && (
            <span className='small-text-lower'>
              {totalBreak.hr} hr {totalBreak.min} mins
            </span>
          )}
        </div>
        <div className='inner-block'>
          <span className='small-text-lower'>Overtime</span>
          {totalOverTimeMinutes && (
            <span className='small-text-lower'>
              {totalOverTimeMinutes.hr} hr {totalOverTimeMinutes.min} mins{' '}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default TimeSheetDetails
