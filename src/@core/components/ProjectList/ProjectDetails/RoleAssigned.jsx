import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Box, Card, CardContent, CardHeader } from '@mui/material'
import cs from 'classnames'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import CustomInput from '../../../../components/CustomInput'
import InputAdornment from '@mui/material/InputAdornment'
import ProjectProgress from '../../../../components/ProjectProgress'
import { stringAvatar } from '../../../../../utils/helper'
import { useProjectStore } from '../../../../store/project'
import { Axios } from '../../../../../api/axios'

const Details = ({ user, editAccessUserRoles = [], handleChangeHrs }) => {
  const { employee = {}, employeeId, role, hours } = user
  const { name, profile, designation, employeeStatus } = employee || {}
  const [hoursVal, setHoursVal] = useState(hours)
  const inputRef = useRef()
  const { project, setProject } = useProjectStore()

  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setHoursVal(hours)
  }, [hours])

  const projects = useMemo(() => {
    return (
      employee?.projects &&
      employee?.projects?.reduce((acc, current) => {
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
    )
  }, [employee.projects])

  useEffect(() => {
    setLoading(true)
    Axios.get(`user/${employeeId}`).then(d => {
      if (d) {
        setUserData(d)
      } else {
        setUserData([])
      }
      setLoading(false)
    })
  }, [employeeId])

  const isActiveEmp = userData.employeeStatus === 'active'

  return (
    <div className={cs('d-flex justify-between align-center w-full pb-12', { ['action-not-allowed']: !isActiveEmp })}>
      <Link passHref href={`/employee-profile?userId=${employeeId}`} className='mb-12'>
        <div className='details cursor-pointer'>
          <Avatar {...stringAvatar(name)} src={profile} />
          <div>
            <Typography variant='subtitle2' color='text.secondary' className='them-color'>
              {userData?.name}
            </Typography>
            {userData?.designation && (
              <Typography variant='body2' color='text.secondary'>
                {userData?.designation}
              </Typography>
            )}
            {/*<ProjectProgress projects={projects}/>*/}
          </div>
        </div>
      </Link>
      {editAccessUserRoles.includes(role) && isActiveEmp ? (
        <CustomInput
          size='small'
          sx={{ width: 80 }}
          value={hoursVal}
          onChange={({ target: { value } }) => {
            setHoursVal(value)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              inputRef.current.blur()
            }
          }}
          onBlur={() => {
            handleChangeHrs(hoursVal, user)
          }}
          ref={inputRef}
          type='number'
          InputProps={{
            endAdornment: <InputAdornment position='end'>hrs</InputAdornment>
          }}
        />
      ) : (
        `${hours} hrs`
      )}
    </div>
  )
}

const RoleAssigned = ({ role, userList, editAccessUserRoles = [], handleChangeHrs = () => {} }) => {
  console.log('@@@role', role, userList)

  return (
    <Card variant='outlined' className='h-full w-full'>
      <div className='assigned-details'>
        <CardHeader className='them-color roleName' title={role.replace('_', ' ')} />
      </div>
      <CardContent style={{ paddingTop: 0 }}>
        <Box>
          {userList.map(user => (
            <Details
              key={user.id}
              user={user}
              editAccessUserRoles={editAccessUserRoles}
              handleChangeHrs={handleChangeHrs}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default RoleAssigned
