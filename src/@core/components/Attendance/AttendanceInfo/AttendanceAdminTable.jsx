import React, { useEffect, useMemo, useState } from 'react'
import { Axios } from '../../../../../api/axios'
import dayjs from 'dayjs'
import { useAttendanceStore } from '../../../../store/attendance'
import Loader from '../../../../components/Loader'
import CustomTable from '../../../layouts/components/shared-components/CustomTable'
import Check from 'mdi-material-ui/Check'
import Close from 'mdi-material-ui/Close'
import {
  ACTIVITY,
  convertStartToEndDateArray,
  getCurrentDate,
  getOneDayTime,
  getFormattedDate,
  startOfMonthDay,
  subtractTime,
  totalBreakTime,
  totalOverTime
} from '../../../../../utils/helper'
import CustomModal from '../../CustomModal'
import TimeSheetDetails from '../TimeSheetDetails'
import { Box, Container, FormControl } from '@mui/material'
import CustomBreadcrumb from '../../../layouts/components/shared-components/CustomBreadcrumb'
import TodaysActivity from '../TodaysActivity'
import Weekend from '../../../../asset/image/weekend.png'
import WeekendLeave from '../../../../asset/image/student-leave.png'
import DoubleTick from '../../../../asset/image/DoubleTick.png'
import CelebrationIcon from 'mdi-material-ui/Beach'
import { useRouter } from 'next/router'
import CustomInput from '../../../../components/CustomInput'
import CustomDatePicker from '../../../layouts/components/shared-components/CustomDatePicker'
import { useDebounce } from '../../../../hooks/useDebounce'
import useWindowSize from '../../../../hooks/useWindowSize'

const AttendanceAdminTable = () => {
  const { allDataLoading, setAllDataLoading } = useAttendanceStore()
  const router = useRouter()
  const [columns, setColumns] = useState([])
  const [tableData, setTableData] = useState([])
  const [open, setOpen] = useState(null)

  const { width } = useWindowSize()
  const pinnedColumns = width >= 768 ? { left: ['name'], right: ['workingTime'] } : {}

  const startDate = startOfMonthDay()
  const endDate = getCurrentDate()
  const { pathname, query } = router
  const { name, from, to } = query
  const fromStartDate = from ? from : ''
  const toEndDate = to ? to : ''
  const searchName = name ? decodeURIComponent(name) : ''
  const fromDate = fromStartDate || startDate
  const toDate = toEndDate || endDate

  const [searchData, setSearchData] = useState({
    name: searchName,
    from: fromDate,
    to: toDate
  })

  const searchNameDebounce = useDebounce(searchData.name, 1000)

  const [loading, setLoading] = useState()

  const clickForNoDataIcon = (params, user, date) => {
    const activity = []
    const totalBreak = totalBreakTime(activity)
    const userID = params.row.id
    const totalOverTimeMinutes = totalOverTime(activity, subtractTime(user.workingHours, user.break))
    setOpen({
      date,
      user,
      totalBreak,
      totalOverTimeMinutes,
      activity,
      isClose: true,
      userID
    })
  }

  const getUserData = (startDate, endDate, withLoading) => {
    if (withLoading) {
      setAllDataLoading(true)
    }

    Axios.get(`attendance?startDate=${getFormattedDate(startDate)}&endDate=${getFormattedDate(endDate)}`)
      .then(data => {
        if (data?.userList && Object.keys(data.userList).length > 0) {
          const { userList } = data
          const holiday = data.holidays || []
          const allDate = convertStartToEndDateArray(startDate, endDate)

          const col = allDate.map(date => {
            return {
              field: date,
              headerName: (
                <p className='header-date'>
                  {dayjs(date).format('DD')}
                  <br />
                  {dayjs(date).format('ddd')}
                </p>
              ),
              width: 70,
              renderCell: params => {
                const isWorkingDay = params.row.user?.workingDays?.includes(dayjs(date).format('dddd'))

                const isHoliday = holiday.find(
                  item => dayjs(item.date).format('MM-DD-YYYY') === dayjs(date).format('MM-DD-YYYY')
                )

                const activity = params.row[date]?.activity || []
                const activityId = params.row[date]?.activityId
                const totalBreak = totalBreakTime(activity)
                const userID = params.row.id
                const user = params.row.user
                const totalOverTimeMinutes = totalOverTime(activity, subtractTime(user.workingHours, user.break))

                if (isHoliday) {
                  if (params.row[date]) {
                    return (
                      <div className='attendanceIcon'>
                        <img
                          src={DoubleTick.src}
                          alt='WorkedAtHoliday'
                          className='cursor-pointer'
                          onClick={() => {
                            setOpen({
                              date,
                              user,
                              totalBreak,
                              totalOverTimeMinutes: totalOverTime(activity, 0),
                              activity,
                              userID,
                              activityId
                            })
                          }}
                        />
                      </div>
                    )
                  }

                  return (
                    <div className='attendanceIcon'>
                      <CelebrationIcon
                        alt='Holiday'
                        className='cursor-pointer'
                        onClick={() => clickForNoDataIcon(params, user, date)}
                      />
                    </div>
                  )
                } else if (params.row[date] && isWorkingDay) {
                  if (!!totalOverTimeMinutes.hr || !!totalOverTimeMinutes.min) {
                    return (
                      <div className='attendanceIcon'>
                        <img
                          src={DoubleTick.src}
                          alt='WorkedAtHoliday'
                          className='cursor-pointer'
                          onClick={() => {
                            setOpen({
                              date,
                              user,
                              totalBreak,
                              totalOverTimeMinutes,
                              activity,
                              userID,
                              activityId
                            })
                          }}
                        />
                      </div>
                    )
                  }

                  return (
                    <div className='checkIconWrapper'>
                      <Check
                        className='checkIcon'
                        onClick={() => {
                          setOpen({
                            date,
                            user,
                            totalBreak,
                            totalOverTimeMinutes,
                            activity,
                            activityId,
                            userID
                          })
                        }}
                      />
                    </div>
                  )
                } else if (!params.row[date] && isWorkingDay) {
                  return (
                    <div className='closeIconWrapper'>
                      <Close className='closeIcon' onClick={() => clickForNoDataIcon(params, user, date)} />
                    </div>
                  )
                } else if (params.row[date]) {
                  return (
                    <div className='attendanceIcon'>
                      <img
                        src={DoubleTick.src}
                        alt='WorkedAtHoliday'
                        className='cursor-pointer'
                        onClick={() => {
                          setOpen({
                            date,
                            user,
                            totalBreak,
                            totalOverTimeMinutes: totalOverTime(activity, 0),
                            activity,
                            userID,
                            activityId
                          })
                        }}
                      />
                    </div>
                  )
                } else {
                  return (
                    <div className='attendanceIcon'>
                      <img
                        src={dayjs(date).format('ddd') === 'Sun' ? Weekend.src : WeekendLeave.src}
                        alt='Weekend'
                        className='cursor-pointer'
                        onClick={() => clickForNoDataIcon(params, user, date)}
                      />
                    </div>
                  )
                }
              }
            }
          })

          const totalWorkingtime = {
            field: 'workingTime',
            headerName: 'Working Time',
            width: 150,
            editable: false,
            renderCell: params => {
              const allDate = convertStartToEndDateArray(startDate, endDate)
              let totalWorkingTimeHours = 0
              let totalWorkingTimeMinutes = 0

              allDate.forEach(date => {
                const activity = params.row[date]?.activity || []

                const time = getOneDayTime(activity, ACTIVITY.PUNCH_IN)
                const hr = parseInt(time / 60)
                const min = dayjs().minute(time).$m

                totalWorkingTimeHours += hr
                totalWorkingTimeMinutes += min

                if (totalWorkingTimeMinutes >= 60) {
                  totalWorkingTimeHours += Math.floor(totalWorkingTimeMinutes / 60)
                  totalWorkingTimeMinutes %= 60
                }
              })

              const getTotalWorkingTime =
                totalWorkingTimeHours || totalWorkingTimeMinutes
                  ? `${totalWorkingTimeHours} hrs ${totalWorkingTimeMinutes} mins`
                  : '-'

              return <div className='total-workingTime'>{getTotalWorkingTime}</div>
            }
          }

          const totalOvertime = {
            field: 'overTime',
            headerName: 'Over Time',
            width: 150,
            editable: false,
            renderCell: params => {
              const allDate = convertStartToEndDateArray(startDate, endDate)
              let totalOverTimeHours = 0
              let totalOverTimeMinutes = 0

              allDate.forEach(date => {
                const activity = params.row[date]?.activity || []
                const isWorkingDay = params.row.user?.workingDays?.includes(dayjs(date).format('dddd'))

                const isHoliday = holiday.find(
                  item => dayjs(item.date).format('MM-DD-YYYY') === dayjs(date).format('MM-DD-YYYY')
                )
                const user = params.row.user
                const workingHours = user.workingHours
                const userBreak = user.break

                const totalOverTimeForDate = totalOverTime(activity, subtractTime(workingHours, userBreak))

                totalOverTimeHours += totalOverTimeForDate.hr
                totalOverTimeMinutes += totalOverTimeForDate.min

                if (isHoliday || !isWorkingDay) {
                  if (params.row[date]) {
                    const time = getOneDayTime(activity, ACTIVITY.PUNCH_IN)
                    const hr = parseInt(time / 60)
                    const min = dayjs().minute(time).$m
                    totalOverTimeHours += hr
                    totalOverTimeMinutes += min
                  }
                }
                if (totalOverTimeMinutes >= 60) {
                  totalOverTimeHours += Math.floor(totalOverTimeMinutes / 60)
                  totalOverTimeMinutes %= 60
                }
              })

              const getTotalOverTime =
                totalOverTimeHours || totalOverTimeMinutes
                  ? `${totalOverTimeHours} hrs ${totalOverTimeMinutes} mins`
                  : '-'

              return <div className='total-OverTime'>{getTotalOverTime}</div>
            }
          }

          const totalColumns = [
            {
              field: 'name',
              headerName: 'Employee',
              width: 150,
              editable: false,
              renderCell: params => {
                return (
                  <div
                    className='cursor-pointer text-link'
                    onClick={() => {
                      router.push({
                        pathname: '/employee-profile',
                        query: { userId: params.row.id }
                      })
                    }}
                  >
                    {params.row.name}
                  </div>
                )
              }
            }
          ]
          col?.map(val => {
            totalColumns.push(val)
          })
          totalColumns.push(totalWorkingtime)
          totalColumns.push(totalOvertime)
          setColumns(totalColumns)

          if (userList.startDate) {
            delete userList['startDate']
          }
          if (userList.endDate) {
            delete userList['endDate']
          }
          const allUserIds = Object.keys(userList)

          const newArray = allUserIds.map(userId => {
            const user = userList[userId].user
            const userAttendance = userList[userId].attendance
            const dates = {}
            userAttendance.forEach(a => {
              dates[dayjs(a.date).format('MM-DD-YYYY')] = {
                activity: a.activity,
                activityId: a.id
              }
            })

            return { id: userId, name: user.name, user, ...dates }
          })
          setTableData(newArray)
        } else {
        }
      })
      .catch(e => {
        console.log('Error', e.message)
      })
      .finally(() => {
        setAllDataLoading(false)
        setLoading(false)
      })
  }

  const filteredUsers = useMemo(() => {
    return tableData.filter(user => user.name.toLowerCase().includes(searchData.name.toLowerCase()))
  }, [tableData, searchData.name])

  useEffect(() => {
    const param = { ...query }
    if (searchData.name) {
      param.name = encodeURIComponent(searchData.name)
    } else {
      delete param['name']
    }
    if (searchData.from) {
      param.from = getFormattedDate(searchData.from)
    } else {
      delete param['from']
    }
    if (searchData.to) {
      param.to = getFormattedDate(searchData.to)
    } else {
      delete param['to']
    }
    router.push(
      {
        pathname,
        query: { ...param }
      },
      undefined,
      {
        shallow: true
      }
    )
  }, [searchNameDebounce, searchData.from, searchData.to])

  const handleChange = e => {
    const { name, value } = e.target
    setSearchData({ ...searchData, [name]: value })
  }

  const handleDateChange = (name, value) => {
    setSearchData({ ...searchData, [name]: value ? value.toISOString() : null })
  }

  useEffect(() => {
    const startDate = searchData.from
    const endDate = searchData.to
    getUserData(startDate, endDate, true)
  }, [searchData.to, searchData.from])

  const handleSaveActivity = (activity, activityId, mode) => {
    setOpen({ ...open, activity })

    if (mode === 'delete') {
      const updateTableValue = tableData.map(tableRow => {
        if (tableRow.id === open.userID) {
          if (tableRow.hasOwnProperty(open.date)) {
            delete tableRow[open.date]
          }

          return { ...tableRow }
        }

        return { ...tableRow }
      })
      setTableData(updateTableValue)
    } else {
      const updateTableValue = tableData.map(tableRow => {
        if (tableRow.id === open.userID) {
          if (tableRow.hasOwnProperty(open.date)) {
            tableRow[open.date].activity = activity

            return tableRow
          }
          tableRow[open.date] = {
            activity,
            activityId
          }

          return { ...tableRow }
        }

        return { ...tableRow }
      })
      setTableData(updateTableValue)
    }
  }

  if (allDataLoading) return <Loader />

  return (
    <div>
      <Box sx={{ width: '100%', display: 'flex', flexFlow: 'column' }}>
        <Box sx={{ marginBottom: '25px' }}>
          <CustomBreadcrumb title='Attendance' BreadcrumbTitle='Attendance' />
        </Box>
        <Container>
          <div className='leave-wrapper attendance-admin-wrapper mt-24'>
            <div className='search-attendance-employees scrollbar-css'>
              <FormControl>
                <CustomInput label='Name' name='name' value={searchData.name} onChange={handleChange} />
              </FormControl>

              <FormControl>
                <Box>
                  <CustomDatePicker
                    label='From'
                    value={searchData.from ? dayjs(searchData.from) : null}
                    onChange={newValue => handleDateChange('from', newValue)}
                  />
                </Box>
              </FormControl>

              <FormControl>
                <Box>
                  <CustomDatePicker
                    label='To'
                    value={searchData.to ? dayjs(searchData.to) : null}
                    onChange={newValue => handleDateChange('to', newValue)}
                  />
                </Box>
              </FormControl>
            </div>
            <CustomTable columns={columns} rows={filteredUsers} loading={loading} pinnedColumns={pinnedColumns} />
          </div>
        </Container>
        {open && (
          <CustomModal open handleClose={() => setOpen(null)}>
            <div style={{ width: '100%', display: 'flex' }}>
              <TimeSheetDetails
                userDetails={open.user}
                date={open.date}
                totalBreak={open.totalBreak}
                totalOverTimeMinutes={open.totalOverTimeMinutes}
                activity={open.activity}
                isClose={open?.isClose}
                isPreview
              />

              <div className='timeSheetDetails ml-18'>
                <TodaysActivity
                  attendance={{ activity: open.activity }}
                  date={open.date}
                  userId={open.userID}
                  setOpen={setOpen}
                  handleSaveActivity={handleSaveActivity}
                  withEdit
                  activityId={open.activityId}
                />
              </div>
            </div>
          </CustomModal>
        )}
      </Box>
    </div>
  )
}

export default AttendanceAdminTable
