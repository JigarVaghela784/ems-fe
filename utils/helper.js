import dayjs from 'dayjs'
import CircleSlice8 from 'mdi-material-ui/CircleSlice8'
import utc from 'dayjs/plugin/utc'
import { adminAndHRRouters, commonRouters } from './routers'

dayjs.extend(utc)

export const ACTIVITY = {
  WORKING_TIME: 8,
  PUNCH_IN: 'Punch In',
  PUNCH_OUT: 'Punch Out'
}

export const ifscRegex = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/

export const panRegex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/

export const phoneRegex = /^[6-9][0-9]{9}$/

export const userRole = {
  ADMIN: 'admin',
  HR: 'hr',
  PROJECT_OWNER: 'project_owner',
  PROJECT_MANAGER: 'project_manager',
  TEAM_LEADER: 'team_leader',
  EMPLOYEE: 'employee'
}

export const LeaveStatus = {
  APPROVE: 'active',
  PENDING: 'pending',
  DECLINE: 'inactive'
}

export const TabViewType = {
  GRID: 'grid-view',
  TABLE: 'table-view'
}

export const userRoleValue = {
  [userRole.ADMIN]: 0,
  [userRole.HR]: 1,
  [userRole.PROJECT_OWNER]: 2,
  [userRole.PROJECT_MANAGER]: 3,
  [userRole.TEAM_LEADER]: 4,
  [userRole.EMPLOYEE]: 5
}

export const checkIsValidPage = (role, path) => {
  if (path === '/') return true
  let isValid
  if ([userRole.ADMIN, userRole.HR].includes(role)) {
    isValid = [...commonRouters, ...adminAndHRRouters].find(route => path.includes(route))
  } else {
    isValid = [...commonRouters].find(route => path.includes(route))
  }

  return isValid
}

export const convertAirtableToUserArray = (data = []) => {
  return data?.map(val => {
    return {
      email: '',
      ...val.fields,
      id: val.id,
      createdTime: val.createdTime
    }
  })
}

export const WORKING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const statusList = [
  {
    name: 'Approve',
    value: LeaveStatus.APPROVE,
    icons: <CircleSlice8 style={{ color: '#07bc0c', fontSize: 16, marginRight: 2 }} />
  },
  {
    name: 'Pending',
    value: LeaveStatus.PENDING,
    icons: <CircleSlice8 style={{ color: 'orange', fontSize: 16, marginRight: 2 }} />
  },
  {
    name: 'Decline',
    value: LeaveStatus.DECLINE,
    icons: <CircleSlice8 style={{ color: '#e74c3c', fontSize: 16, marginRight: 2 }} />
  }
]

export const subtractTime = (originalTime, minutesToSubtract) => {
  const originalHours = parseFloat(originalTime)
  const originalMinutes = originalHours * 60
  const resultMinutes = originalMinutes - minutesToSubtract * 60
  const resultHours = resultMinutes / 60

  return resultHours.toFixed(2)
}

export const calculateDateDifference = (startDate, endDate) => {
  // Convert the input dates to JavaScript Date objects
  const startDateObj = new Date(startDate)
  const endDateObj = new Date(endDate)

  // Calculate the difference in years and months
  let yearsDiff = endDateObj.getFullYear() - startDateObj.getFullYear()
  let monthsDiff = endDateObj.getMonth() - startDateObj.getMonth()

  // Handle cases where monthsDiff might be negative
  if (monthsDiff < 0) {
    yearsDiff--
    monthsDiff += 12
  }

  // Create the formatted string
  const formattedString = yearsDiff > 0 ? yearsDiff + ' year' + (yearsDiff !== 1 ? 's' : '') + ' ' : ''

  const monthsString = monthsDiff > 0 ? monthsDiff + ' month' + (monthsDiff !== 1 ? 's' : '') : ''

  // Combine the year and month parts of the string
  return yearsDiff > 0 && monthsDiff > 0 ? formattedString + monthsString : formattedString || monthsString
}

export const getUserRoles = (role = '') => {
  return {
    isAdmin: role === userRole.ADMIN,
    isHR: role === userRole.HR,
    isEmployee: role === userRole.EMPLOYEE,
    isProjectOwner: role === userRole.PROJECT_OWNER,
    isProjectManager: role === userRole.PROJECT_MANAGER,
    isTeamLeader: role === userRole.TEAM_LEADER
  }
}

export const getCurrentDate = date => {
  const val = date ? new Date(date) : new Date()

  return val.toISOString()
}

export const dayStartDate = date => {
  const start = date ? new Date(date) : new Date()
  start.setUTCHours(0, 0, 0, 0)

  return start.toISOString()
}

export const startOfMonthDay = date => {
  const val = date ? new Date(date) : new Date()
  const firstDay = new Date(val.getFullYear(), val.getMonth(), 1)

  return firstDay.toISOString()
}

export const dayEndDate = date => {
  const end = date ? new Date(date) : new Date()
  end.setUTCHours(23, 59, 59, 999)

  return end.toISOString()
}

export const dayEndMonthDate = date => {
  const month = dayjs(date).month()
  const year = dayjs(date).year()
  const d = new Date(year, month + 1, 0)

  return d.toISOString()
}

export const next30Day = date => {
  const today = date ? new Date(date) : new Date()

  return new Date(new Date().setDate(today.getDate() + 30)).toISOString()
}

export const getStatusColor = employeeStatus => {
  switch (employeeStatus) {
    case 'deactivated':
      return '#e74c3c'
    case 'pending':
      return 'orange'
    default:
      return '#07bc0c'
  }
}

export const COOKIE_PATH = process.env.NEXT_PUBLIC_COOKIE_PATH || '/'

export const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'localhost'

export const COOKIE_SAME_SITE = process.env.NEXT_PUBLIC_COOKIE_SAME_SITE || 'lax'

export const REACT_APP_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development'

export const setCookiesOptions = () => {
  return {
    path: COOKIE_PATH,
    sameSite: COOKIE_SAME_SITE,
    domain: window.location.hostname,
    secure: REACT_APP_ENVIRONMENT === 'production'
  }
}

export const formattedTime = elapsedTime =>
  `${Math.floor(elapsedTime / 3600000)
    .toString()
    .padStart(2, '0')}:${Math.floor((elapsedTime % 3600000) / 60000)
    .toString()
    .padStart(2, '0')}:${Math.floor((elapsedTime % 60000) / 1000)
    .toString()
    .padStart(2, '0')}`

export const capitalizeFLetter = string => {
  return string[0].toUpperCase() + string.slice(1)
}

export const getOneDayTime = (activity, status = ACTIVITY.PUNCH_IN, unit = 'minutes', handleSetTime) => {
  let breakMin = 0
  if (activity.length > 0) {
    activity.forEach((ac, i) => {
      const isLastPunchIn = ac.status === status
      const nextObj = activity[i + 1]
      const date1 = dayjs(ac.time)
      const date2 = dayjs(nextObj?.time || (status === ACTIVITY.PUNCH_IN ? Date.now() : 0))
      const diff = date2.diff(date1, unit, true)
      if (!nextObj) {
        if (status === ac.status && dayjs(date1).isSame(date2, 'day')) {
          if (handleSetTime) handleSetTime(breakMin, diff)
          breakMin += diff
        }

        return
      }
      if (isLastPunchIn) {
        breakMin += diff
      }
    })
  }

  return breakMin
}

export const totalBreakTime = activity => {
  const time = getOneDayTime(activity, ACTIVITY.PUNCH_OUT)
  const hr = parseInt(time / 60)
  const min = dayjs().minute(time).$m

  return { hr, min }
}

export const totalWorkingTime = activity => {
  const productionTime = getOneDayTime(activity)
  const breakTime = getOneDayTime(activity, ACTIVITY.PUNCH_OUT)
  const time = productionTime + breakTime
  const hr = parseInt(time / 60)
  const min = dayjs().minute(time).$m

  return { hr, min }
}

export const totalOverTime = (activity, workingTime = ACTIVITY.WORKING_TIME) => {
  const time = getOneDayTime(activity, ACTIVITY.PUNCH_IN)
  if (time / 60 < workingTime) {
    return { hr: 0, min: 0 }
  }
  const overTimeTime = time - workingTime * 60
  const hr = parseInt(overTimeTime / 60)
  const min = dayjs().minute(overTimeTime).$m

  return { hr: hr, min }
}

export const convertStartToEndDateArray = (start, end) => {
  if (!start || !end) return []
  const startDate = dayjs(start)
  const endDate = dayjs(end)
  const dateArray = []
  let currentDate = startDate
  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    dateArray.push(currentDate.format('MM-DD-YYYY'))
    currentDate = currentDate.add(1, 'day')
  }

  return dateArray
}

export const monthMap = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12
}

export const percentage = (value1, value2) => (value1 / value2) * 100

export const getContrastColor = hexColor => {
  // Convert hex color to RGB
  const r = parseInt(hexColor.substring(1, 3), 16)
  const g = parseInt(hexColor.substring(3, 5), 16)
  const b = parseInt(hexColor.substring(5, 7), 16)

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Choose black or white as text color based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export const stringToColor = (string = '', withBg, opacity = 30) => {
  let hash = 0
  let i
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 6)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }

  return withBg ? `${color}${opacity}` : color
}

export function dataURLtoFile(dataUrl, filename) {
  let arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

export const stringAvatar = name => {
  if (name)
    return {
      sx: {
        bgcolor: stringToColor(name, true),
        color: stringToColor(name),
        cursor: 'pointer',
        textTransform: 'uppercase'
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1] ? name.split(' ')[1][0] : ''}`
    }

  return '#fff'
}

export const projectRoles = {
  project_owner: 'project_owner',
  project_manager: 'project_manager',
  team_leader: 'team_leader',
  employee: 'employee'
}

export const convertToObject = input => {
  const output = {
    name: input.name,
    cost: input.cost,
    weeklyHours: input.weeklyHours,
    createdDate: input.createdDate ? getCurrentDate(input.createdDate) : null,
    deadlineDate: input.deadlineDate ? getCurrentDate(input.deadlineDate) : null,
    priority: input.priority,
    status: input.status,
    description: input.description,
    employees: []
  }

  for (const role in projectRoles) {
    if (input[role]) {
      input[role].forEach(employeeId => {
        const empObj = {
          employeeId: employeeId,
          role: projectRoles[role],
          hours: '5'
        }
        if (input.id) {
          empObj.projectId = input.id
        }
        output.employees.push(empObj)
      })
    }
  }

  return output
}

export const getEventDate = (startDate, EndDate) => {
  if (
    dayjs(startDate).format('MMM') === dayjs(EndDate).format('MMM') &&
    dayjs(startDate).format('YYYY') === dayjs(EndDate).format('YYYY')
  ) {
    return `${dayjs(startDate).format(' D')} - ${dayjs(EndDate).format('D MMM, YYYY')}`
  } else if (
    dayjs(startDate).format('MMM') !== dayjs(EndDate).format('MMM') &&
    dayjs(startDate).format('YYYY') === dayjs(EndDate).format('YYYY')
  ) {
    return `${dayjs(startDate).format(' D MMM')} - ${dayjs(EndDate).format(' D MMM, YYYY')}`
  } else if (!EndDate) {
    return dayjs(startDate).format('D MMM, YYYY')
  } else {
    return `${dayjs(startDate).format('MMM D, YYYY')} - ${dayjs(EndDate).format('MMM D,YYYY')}`
  }
}

export const calculateTotalTime = (arr, key) => {
  let hours = 0
  let mins = 0
  arr.forEach(item => {
    if (item[key]?.split(' ')) {
      const time = item[key]?.split(' ')
      hours += +time[0] ? +time[0] : 0
      mins += +time[2] ? +time[2] : 0
    }
  })

  return `${hours + Math.floor(mins / 60)} hrs ${mins % 60} mins`
}

export const getRoleMembers = (employees = []) => {
  const data = {
    project_owner: [],
    project_manager: [],
    team_leader: [],
    employee: []
  }

  employees.forEach(member => {
    const updateMemberProjects = member.employee?.projects.reduce((result, current) => {
      const existingItem = result.find(item => item.projectId === current.projectId)

      if (existingItem) {
        // If project already exists in the result array, add the hours
        existingItem.hours = (parseInt(existingItem.hours, 10) + parseInt(current.hours, 10)).toString()
      } else {
        // If project doesn't exist in the result array, add it
        result.push({
          ...current
        })
      }

      return result
    }, [])

    data[member.role]?.push({ ...member, employee: { ...member.employee, projects: updateMemberProjects } })
  })

  return data
}

export const getUniqueListBy = (arr, key) => {
  return [...new Map(arr.map(item => [item?.[key], item])).values()]
}

export const getIsEmpty = (node = []) => {
  if (('children' in node && !node.children.length) || ('text' in node && node.text?.trim() === '')) return true
  if ('children' in node) return node.children?.every(d => getIsEmpty(d))

  return false
}

export const getFormattedDate = (date, format = 'YYYY-MM-DD') => {
  return dayjs(date).format(format)
}
