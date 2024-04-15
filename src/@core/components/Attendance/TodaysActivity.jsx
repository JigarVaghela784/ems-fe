import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import CustomButton from '../../layouts/components/shared-components/CustomButton'
import TodaysActivityList from './TodaysActivityList'
import { Axios } from 'api/axios'
import { ACTIVITY } from 'utils/helper'
import { useAttendanceStore } from 'src/store/attendance'
import { toast } from 'react-toastify'

dayjs.extend(utc)
dayjs.extend(localizedFormat)

const TodaysActivity = ({ attendance = {}, date, activityId, withEdit, handleSaveActivity, userId, setOpen }) => {
  const [editMode, setEditMode] = useState(false)
  const [activity, setActivity] = useState(attendance.activity || [])
  const [loading, setLoading] = useState(false)
  const { setAttendance } = useAttendanceStore()

  useEffect(() => {
    setActivity(attendance.activity)
  }, [attendance.activity])

  const handleEditMode = () => {
    setEditMode(true)
  }

  useEffect(() => {
    setActivity(attendance.activity)
  }, [attendance.activity])

  const handleAdd = () => {
    const newObj = {
      time: activity?.length > 0 ? activity[activity.length - 1].time : dayjs(date).toISOString(),
      status:
        activity?.length > 0
          ? activity[activity.length - 1].status === ACTIVITY.PUNCH_IN
            ? ACTIVITY.PUNCH_OUT
            : ACTIVITY.PUNCH_IN
          : ACTIVITY.PUNCH_IN
    }
    setActivity([...activity, newObj])
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      if (activityId && !activity?.length) {
        await Axios.delete(`attendance/delete/${activityId}`)
        toast.success('Activity deleted successfully')
        handleSaveActivity(activity, null, 'delete')
      } else {
        let saveActivityId = activityId
        if (activityId) {
          await Axios.patch(`attendance/${activityId}`, { activity: activity })
          toast.success('Activity updated successfully')
        } else {
          const response = await Axios.post(`attendance`, {
            activity: activity,
            date: new Date(new Date(date).setHours(10)).toISOString(),
            userId
          })
          saveActivityId = response.id
          toast.success('Activity added successfully')
        }
        handleSaveActivity(activity, saveActivityId, 'save')
      }

      setEditMode(false)
      setOpen(null)
    } catch (e) {
      console.log(e?.response?.data?.message || e.message)
      toast.error(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='block-wrapper block-wrapper-scroll'>
      <div className='title'>Today's Activity</div>

      {!activity?.length ? (
        <div className='no-data'>No entries</div>
      ) : (
        <div className='activities-wrapper'>
          {activity?.map((item, i) => {
            return (
              <TodaysActivityList
                key={i}
                index={i}
                item={item}
                editMode={editMode}
                activity={activity}
                setActivity={setActivity}
              />
            )
          })}
        </div>
      )}

      {withEdit && (
        <div className='mt-5'>
          {editMode && (
            <CustomButton size='small' fullWidth={false} className='mr-10' variant='outlined' onClick={handleAdd}>
              Add
            </CustomButton>
          )}
          <CustomButton
            size='small'
            fullWidth={false}
            variant={editMode ? 'contained' : 'outlined'}
            onClick={editMode ? handleSave : handleEditMode}
            loading={loading}
          >
            {editMode ? 'Save' : 'Edit'}
          </CustomButton>
        </div>
      )}
    </div>
  )
}

export default TodaysActivity
