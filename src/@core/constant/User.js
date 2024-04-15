import { userRole } from '../../../utils/helper'
import CircleSlice8 from 'mdi-material-ui/CircleSlice8'

const { ADMIN, PROJECT_OWNER, EMPLOYEE, HR, PROJECT_MANAGER, TEAM_LEADER } = userRole

export const UserData = [
  {
    id: 1,
    image: 'https://picsum.photos/200/300',
    name: 'Kashyap',
    designation: 'Software Engineer'
  },
  {
    id: 2,
    image: 'https://picsum.photos/200/300',
    name: 'Mohit',
    designation: 'Software Engineer'
  },
  {
    id: 3,
    image: 'https://picsum.photos/200/300',
    name: 'Rohit1',
    designation: 'Software Engineer'
  },
  {
    id: 4,
    image: 'https://picsum.photos/200/300',
    name: 'Rohit2',
    designation: 'Software Engineer'
  },
  {
    id: 5,
    image: 'https://picsum.photos/200/300',
    name: 'Rohit',
    designation: 'Software Engineer'
  },
  {
    id: 6,
    image: 'https://picsum.photos/200/300',
    name: 'Rohit3',
    designation: 'Software Engineer'
  },
  {
    id: 7,
    image: 'https://picsum.photos/200/300',
    name: 'Rohit4',
    designation: 'Software Engineer'
  },
  {
    id: 8,
    image: 'https://picsum.photos/200/300',
    name: 'Rohit5',
    designation: 'Software Engineer'
  }
]

export const roleList = [
  {
    label: 'HR',
    value: HR
  },
  {
    label: 'Admin',
    value: ADMIN
  },
  {
    label: 'Project owner',
    value: PROJECT_OWNER
  },
  {
    label: 'Project manager',
    value: PROJECT_MANAGER
  },
  {
    label: 'Team leader',
    value: TEAM_LEADER
  },
  {
    label: 'Employee',
    value: EMPLOYEE
  }
]

export const departmentList = [
  'Administrator',
  'Management',
  'Human Resource',
  'Sales & Marketing',
  'Web',
  'Mobile',
  'UI/UX',
  'Quality Assurance'
]

export const designationList = ['Web Developer', 'UI/UX', 'Full Stack Developer', 'Human Resource', 'Owner']

export const userStatus = [
  {
    label: 'Active',
    value: 'active',
    icons: <CircleSlice8 style={{ color: '#07bc0c', fontSize: 16, marginRight: 2 }} />
  },
  {
    label: 'Inactive',
    value: 'pending',
    icons: <CircleSlice8 style={{ color: 'orange', fontSize: 16, marginRight: 2 }} />
  },
  {
    label: 'Ex employee',
    value: 'deactivated',
    icons: <CircleSlice8 style={{ color: '#e74c3c', fontSize: 16, marginRight: 2 }} />
  }
]

export const genderList = ['Male', 'Female', 'Other']

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']
