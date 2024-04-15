import React, { useEffect, useState } from 'react'
import { Pencil, Email, Phone } from 'mdi-material-ui'
import { Avatar } from '@mui/material'
import EditEmployeeDetails from '../EditEmployeeDetails'
import CustomSelect from '../../layouts/components/shared-components/CustomSelect'
import { useRouter } from 'next/router'
import Badge from '@mui/material/Badge'
import { getFormattedDate, getStatusColor, userRole } from '../../../../utils/helper'
import { Axios } from 'api/axios'
import dayjs from 'dayjs'
import { userStatus } from '../../../@core/constant/User'
import { useUserStore } from '../../../store/user'
import { toast } from 'react-toastify'

const UserCard = ({ handleRemoveEmployee, userData, handleSave, viewOnly }) => {
  const { name, role, id, projects = [] } = userData
  const { allUser, setAllUser } = useUserStore()
  const router = useRouter()
  const [showEditModal, setShowEditModal] = useState(null)
  const [avatar, setAvatar] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleSelect = async (userData, value) => {
    const updatedStatus = allUser.map(item =>
      item.id === userData.id ? { ...item, employeeStatus: value } : { ...item }
    )
    setAllUser(updatedStatus)

    try {
      await Axios.patch('user/edit', { ...userData, employeeStatus: value })
      toast.success('User details updated successfully')
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
    }
  }

  const handleDelete = async id => {
    setDeleteLoading(true)
    try {
      await Axios.delete(`user/${id}`)
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
    }

    setShowEditModal(null)
    handleRemoveEmployee(id)
    setDeleteLoading(false)
  }

  const handleRedirect = () => {
    router.push({
      pathname: '/employee-profile',
      query: { userId: id }
    })
  }

  const getRole = () => {
    const { ADMIN, PROJECT_OWNER, EMPLOYEE, HR, PROJECT_MANAGER, TEAM_LEADER } = userRole
    switch (userData.role) {
      case HR:
        return 'HR'
      case ADMIN:
        return 'Admin'
      case PROJECT_OWNER:
        return 'Project owner'
      case PROJECT_MANAGER:
        return 'Project manager'
      case TEAM_LEADER:
        return 'Team leader'
      case EMPLOYEE:
      default:
        return 'Employee'
    }
  }

  useEffect(() => {
    if (userData?.avatar) {
      setAvatar(userData?.avatar[0]?.url)
    }
  }, [userData?.avatar])

  return (
    <div className='profile-card' key={id}>
      {/*<div className='remove-employee'>*/}
      {/*  <IconButton*/}
      {/*    size='small'*/}
      {/*    aria-label='settings'*/}
      {/*    className='card-more-options'*/}
      {/*    sx={{ color: 'text.secondary' }}*/}
      {/*    id='dropdown-settings'*/}
      {/*    aria-haspopup='true'*/}
      {/*    onClick={() => handleClick(id)}*/}
      {/*    aria-controls='dropdown-settings'*/}
      {/*    aria-expanded={showEditModal ? 'true' : undefined}*/}
      {/*  >*/}
      {/*    <Pencil />*/}
      {/*  </IconButton>*/}
      {/*</div>*/}
      <div className='w-full h-full d-flex align-center justify-center flex-column'>
        <div className='w-full h-full d-flex align-center justify-between flex-column'>
          <div className='w-full'>
            <div className='profile-wrapper' onClick={() => handleRedirect()}>
              <Badge
                overlap='circular'
                onClick={handleRedirect}
                sx={{ ml: 2, cursor: 'pointer' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Avatar className='profile-image' alt='Flora' src={avatar || userData.profile} />
              </Badge>
            </div>

            <div className='title' onClick={() => handleRedirect()}>
              {name}
            </div>
            <div className='designation'>{userData.designation}</div>
          </div>
          {viewOnly ? (
            <div className='user-status' style={{ background: getStatusColor(userData.employeeStatus) }}>
              {userData.employeeStatus}
            </div>
          ) : (
            <div className='user-status'>
              <CustomSelect
                style={{ fontSize: '0.875rem' }}
                id='status'
                options={userStatus}
                className='employee-approval-status'
                value={userData.employeeStatus}
                onChange={({ target: { value } }) => handleSelect(userData, value)}
              />
            </div>
          )}

          <div className=' w-full'>
            <div className='user-details user-bg-1'>
              <div className='user-info'>
                <Email style={{ fontSize: 16 }} />
                <p className='mt-0 mb-0 ml-10'>{userData.email}</p>
              </div>
              {userData.phone && (
                <div className='user-info'>
                  <Phone style={{ fontSize: 16 }} />
                  <p className='mt-0 mb-0 ml-10'>{userData.phone}</p>
                </div>
              )}
            </div>

            <div className='user-details user-bg-2'>
              {/* <div className='user-info justify-between'>
                <p className='mt-0 mb-0'>Desig</p>
                <p className='mt-0 mb-0 font-bold'>{userData.designation ? userData.designation : '-'}</p>
              </div> */}
              <div className='user-info justify-between'>
                <p className='mt-0 mb-0'>Date of Birth</p>
                <p className='mt-0 mb-0 ml-6'>{userData.dob ? getFormattedDate(userData.dob, 'DD MMM YYYY') : '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditEmployeeDetails
        open={showEditModal}
        handleDelete={handleDelete}
        userData={userData}
        setShowEditModal={setShowEditModal}
        id={id}
        handleSave={handleSave}
        avatar={avatar}
        setAvatar={setAvatar}
        deleteLoading={deleteLoading}
      />
    </div>
  )
}

export default UserCard
