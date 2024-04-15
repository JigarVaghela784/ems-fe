import React, { useEffect, useMemo, useState } from 'react'
import TimeSheetDetails from './TimeSheetDetails'
import Statistics from './Statistics'
import TodaysActivity from './TodaysActivity'
import { useAttendanceStore } from '../../../store/attendance'
import {
  totalBreakTime,
  totalOverTime,
  subtractTime,
  dayStartDate,
  next30Day,
  getFormattedDate
} from '../../../../utils/helper'
import { useUserStore } from '../../../store/user'
import dayjs from 'dayjs'
import { useHolidaysStore } from '../../../store/holidays'
import { useTeamLeaves } from 'src/store/teamleaves'
import { Axios } from 'api/axios'
import DashboardLeaves from './DashboardLeaves'
import NoData from 'src/components/NoData'

const Timesheet = ({}) => {
  const today = new Date()

  const { setTeamLeaves } = useTeamLeaves()
  const { attendance = {} } = useAttendanceStore()
  const { user } = useUserStore()
  const { activity = [] } = attendance || {}
  const { upcomingHoliday } = useHolidaysStore()

  // TODO: Project daily update code ( Do not remove )
  // const { projectList, setProjectList } = useProjectStore()
  // const { projectUpdate, setProjectUpdate } = useProjectUpdateStore()
  // const [updatedDataLoading, setUpdatedDataLoading] = useState(false)
  // const [loading, setLoading] = useState(false)
  // const [activeProjectId, setActiveProjectId] = useState(null)

  //TODO: Project daily update code ( Do not remove )
  //
  // const handleChange = (event, newValue) => {
  //   setActiveProjectId(newValue)
  // }

  const totalBreak = useMemo(() => {
    const { hr, min } = totalBreakTime(activity)
    if (hr || min) return { hr, min }

    return null
  }, [activity])

  const totalOverTimeMinutes = useMemo(() => {
    const { hr, min } = totalOverTime(activity, subtractTime(user.workingHours, user.break))
    if (hr || min) {
      return { hr: hr, min }
    }

    return null
  }, [activity, user.workingHours])

  useEffect(() => {
    const startDate = dayStartDate()
    const endDate = next30Day()

    Axios.get(`leave/teams?startDate=${getFormattedDate(startDate)}&endDate=${getFormattedDate(endDate)}`)
      .then(data => {
        setTeamLeaves(data)
      })
      .catch(error => {
        console.log(error)
      })

    // TODO: Project daily update code ( Do not remove )
    // if (projectList.length > 0) return
    // setLoading(true)
    // Axios.get('project')
    //   .then(p => {
    //     if (p) {
    //       setProjectList(p)
    //       if (p.length > 0) {
    //         setActiveProjectId(p[0].id)
    //       }
    //     } else {
    //       setProjectList([])
    //     }
    //   })
    //   .catch(e => {
    //     toast.error(e?.response?.data?.message || e.message)
    //   })
    //   .finally(() => setLoading(false))
  }, [])

  // TODO: Project daily update code ( Do not remove )
  // useEffect(() => {
  //   if (!activeProjectId) return
  //   setUpdatedDataLoading(true)
  //   Axios.get(`project-update?projectId=${activeProjectId}`)
  //     .then(data => {
  //       setProjectUpdate(data.data)
  //     })
  //     .finally(() => setUpdatedDataLoading(false))
  // }, [activeProjectId])

  // TODO: Project daily update code ( Do not remove )
  // const handleSave = (obj, type) => {
  //   obj.employee = user
  //   obj.project = { name: projectList.find(p => p.id === obj.projectId).name }
  //   if (type === 'add') {
  //     setProjectUpdate([obj, ...projectUpdate])
  //   }
  //   if (type === 'edit' || type === 'saveAsDraft') {
  //     const projects = projectUpdate.map(p => {
  //       if (p.id === obj.id) {
  //         return { ...p, ...obj }
  //       }
  //
  //       return p
  //     })
  //     setProjectUpdate([...projects])
  //   }
  // }

  // TODO: Project daily update code ( Do not remove )
  // const filteredProjects = useMemo(() => {
  //   return projectList.map((item, index) => {
  //     return {
  //       name: item.name,
  //       value: item.id
  //     }
  //   })
  // }, [projectList])

  // TODO: Project daily update code ( Do not remove )
  // const handleDelete = data => {
  //   setProjectUpdate(data)
  // }
  //
  // const projectUpdateList = useMemo(() => {
  //   return projectUpdate.reduce((prev, curr) => {
  //     let date = dayjs(curr.createdAt).format('ddd, D MMMM YYYY')
  //     if (!prev[date]) {
  //       prev[date] = []
  //     }
  //
  //     prev[date].push(curr)
  //
  //     return prev
  //   }, {})
  // }, [projectUpdate])

  const upcomingData = useMemo(() => {
    return  upcomingHoliday.length > 0
  }, [ upcomingHoliday])

  return (
    <div className='attendance-wrapper'>
      <div className='timesheet-wrapper'>
        <div className='timeSheetDetails'>
          <TimeSheetDetails
            date={today}
            totalBreak={totalBreak}
            totalOverTimeMinutes={totalOverTimeMinutes}
            activity={activity}
          />
        </div>
        <div className='timeSheetDetails statisticsDetails'>
          <Statistics />
        </div>
        <div className='timeSheetDetails todaysActivityDetails'>
          <TodaysActivity attendance={attendance} />
        </div>
      </div>

      {/*TODO: Project daily update code ( Do not remove )*/}
      {/*<div className='m-10 mt-20 daily-update-wrapper'>*/}
      {/*  <div className='leave-wrapper pl-0 pt-11'>*/}
      {/*    /!*<CardHeader className='them-color' title={<span style={{ width: 'fit-content' }}>Daily Update</span>} />*!/*/}
      {/*    {loading ? (*/}
      {/*      <div className='mt-50 mb-90 d-flex align-center justify-center'>*/}
      {/*        <Loader />*/}
      {/*      </div>*/}
      {/*    ) : (*/}
      {/*      <div className='p-30 pt-50'>*/}
      {/*        <Tabs*/}
      {/*          value={activeProjectId}*/}
      {/*          handleChange={handleChange}*/}
      {/*          className='todays-leaves profile-tabs'*/}
      {/*          tabList={filteredProjects.map(p => {*/}
      {/*            return {*/}
      {/*              value: p.value,*/}
      {/*              label: <p style={{ color: stringToColor(p.name) }}>{p.name}</p>,*/}
      {/*              content: updatedDataLoading ? (*/}
      {/*                <div className='pt-50 mt-50 mb-90 d-flex align-center justify-center'>*/}
      {/*                  <Loader />*/}
      {/*                </div>*/}
      {/*              ) : (*/}
      {/*                <DailyInfo*/}
      {/*                  key={p.value}*/}
      {/*                  grid={6}*/}
      {/*                  isDashboard*/}
      {/*                  withProjectInfo*/}
      {/*                  dailyInfo={projectUpdateList}*/}
      {/*                  handleSave={handleSave}*/}
      {/*                  handleDelete={handleDelete}*/}
      {/*                  update={projectUpdateList}*/}
      {/*                />*/}
      {/*              )*/}
      {/*            }*/}
      {/*          })}*/}
      {/*        />*/}
      {/*      </div>*/}
      {/*    )}*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className='holiday-leaves-wrapper'>
        <DashboardLeaves upcomingData={upcomingData} />
        {(upcomingHoliday.length > 0 ) && (
          <div className='holiday-leaves-width'>
            <div className='block-event'>
              {upcomingHoliday.length > 0 && (
                <div className={'block-border mb-20 block-full-height'}>
                  <div className='title'>Upcoming Holidays</div>
                  <div className='holiday-event-height scrollbar-css'>
                    {upcomingHoliday.length > 0 ? (
                      upcomingHoliday.map((holiday, index) => (
                        <div key={index} className='d-flex align-center justify-between holidayList'>
                          <div>
                            <p className='holidayTitle'>{holiday.title}</p>
                          </div>
                          <div className='text-right holidayDate'>
                            <p className='m-0'>{dayjs(holiday.date).format('DD MMM, YYYY')}</p>
                            <p className='m-0'>{holiday.day}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <NoData />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Timesheet
