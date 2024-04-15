// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import MdiAccountGroup from 'mdi-material-ui/AccountGroupOutline'
import Arrow from 'mdi-material-ui/ChevronRight'
import CelebrationIcon from 'mdi-material-ui/Beach'
import { baseUrl } from 'utils/consts'
import Calendar from 'mdi-material-ui/Calendar'
import CalendarCheck from 'mdi-material-ui/CalendarCheck'
import ClipboardTextClockOutline from 'mdi-material-ui/ClipboardTextClockOutline'
import FormatQuoteOpenOutline from 'mdi-material-ui/FormatQuoteOpenOutline'
import CalendarStar from 'mdi-material-ui/CalendarStar'
import ListBoxOutline from 'mdi-material-ui/ListBoxOutline'
import { userRole } from '../../../utils/helper'

const navigation = role => {
  const list = [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: baseUrl
    },
    {
      title: 'Projects',
      icon: ListBoxOutline,
      path: '/projects'
    },
    {
      title: 'Attendance',
      icon: CalendarCheck,
      path: '/attendance'
    },
    {
      title: 'Leaves',
      icon: Calendar,
      path: '/leaves'
    },
    {
      title: 'Knowledge base',
      icon: Arrow,
      subMenu: [
        {
          title: 'Employees',
          icon: MdiAccountGroup,
          path: '/employees-list'
        },
        {
          title: 'Holidays',
          icon: CelebrationIcon,
          path: '/holidays'
        }
      ]
    }
  ]

  if ([userRole.HR, userRole.ADMIN].includes(role)) {
    const item = {
      title: 'Manage',
      icon: Arrow,
      subMenu: [
        {
          title: 'Attendance',
          icon: ClipboardTextClockOutline,
          path: '/employees-time'
        },
        {
          title: 'Employees',
          icon: MdiAccountGroup,
          path: '/employees-data'
        },
        {
          title: 'Leaves',
          icon: Calendar,
          path: '/leave-manage'
        },
        {
          title: 'Holidays',
          icon: CelebrationIcon,
          path: '/holiday-add'
        }
      ]
    }
    list.push(item)
  }

  return list
}

export default navigation
