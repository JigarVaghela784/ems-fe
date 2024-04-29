import React, { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import { loginUrl } from 'utils/consts'
import { getCookie } from 'cookies-next'
import EmployeeDetails from '../../@core/components/EmployeeProfile/EmployeeDetails'
import EmployeeBankInformation from '../../@core/components/EmployeeProfile/EmployeeBankInformation'
import EmployeeExperience from '../../@core/components/EmployeeProfile/EmployeeExperience'
import { Axios } from '../../../api/axios'
import UserAttendanceTable from 'src/@core/components/UserAttendanceTable'
import LeavesInfo from 'src/@core/components/Leaves/LeavesInfo'
import ProjectList from 'src/@core/components/ProjectList'
import Tabs from '../../components/Tabs'
import { useUserStore } from '../../store/user'
import { getUserRoles } from '../../../utils/helper'
import Loader from 'src/components/Loader'
import CustomButton from '../../@core/layouts/components/shared-components/CustomButton'
import RemoveWarningModal from '../../@core/layouts/components/shared-components/RemoveWarningModal'
import DailyInfo from '../../@core/components/DailyUpdate/DailyInfo'
import { useProjectUpdateStore } from 'src/store/projectupdate'
import { CardHeader } from '@mui/material'
import { useProjectStore } from 'src/store/project'

const EmployeeProfile = ({ allUsers }) => {
  const { user } = useUserStore()
  const { isAdmin, isHR } = getUserRoles(user.role)
  const isAccessToEdit = isAdmin || isHR
  const [value, setValue] = useState(isAccessToEdit ? 'profile' : 'projects')
  const [deleteId, setDeleteId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [updatedDataLoading, setUpdatedDataLoading] = useState(false)
  const { projectUpdate, setProjectUpdate } = useProjectUpdateStore()
  const { projectList } = useProjectStore()

  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { query } = router
  const { userId } = router.query

  const handleChange = (event, newValue) => {
    if (query.from) delete query.from
    if (query.to) delete query.to
    if (query.page) delete query.page
    setValue(newValue)
  }

  const handleCloseDelete = () => setDeleteId(null)
  const handleSetDelete = () => setDeleteId(userId)

  const handleDeleteEmployee = () => {
    setDeleteLoading(true)

    Axios.delete(`user/${userId}`)
      .then(res => {
        router.push('/employees-data?page=1')
      })
      .catch(() => {
        setDeleteLoading(false)
      })
  }

  const handleSave = data => {
    setUserData(data)
  }

  const handleUpdate = (data, dataType) => {
    setUserData({ ...userData, [dataType]: data })
  }

  const handleSaveUpdate = (obj, type) => {
    obj.employee = user
    obj.project = { name: projectList.find(p => p.id === obj.projectId).name }
    if (type === 'add') {
      setProjectUpdate([obj, ...projectUpdate])
    }
    if (type === 'edit' || type === 'saveAsDraft') {
      const projects = projectUpdate.map(p => {
        if (p.id === obj.id) {
          return { ...p, ...obj }
        }

        return p
      })
      setProjectUpdate([...projects])
    }
  }

  const handleDeleteUpdate = data => {
    setProjectUpdate(data)
  }

  useEffect(() => {
    setLoading(true)
    Axios.get(`user/${userId}`).then(d => {
      if (d) {
        setUserData(d)
      } else {
        setUserData([])
      }
      setLoading(false)
    })
  }, [userId])

  const tabList = useMemo(() => {
    const profile = {
      value: 'profile',
      label: 'Profile',
      content: (
        <div className='section-wrapper mt-30 employee-info'>
          <EmployeeBankInformation userData={userData} handleSave={handleSave} />
          <EmployeeExperience userData={userData} handleUpdate={handleUpdate} />
        </div>
      )
    }

    const projects = {
      value: 'projects',
      label: 'Projects',
      content: (
        <div className='section-wrapper pl-0 w-full'>
          <ProjectList showBreadCrumb={false} userId={userId} />
        </div>
      )
    }

    const attendance = {
      value: 'attendance',
      label: 'Attendance',
      content: (
        <div className='w-full'>
          <div className='section-wrapper section-table'>
            <UserAttendanceTable userId={userId} userData={userData} />
          </div>
        </div>
      )
    }

    const leaves = {
      value: 'leaves',
      label: 'Leaves',
      content: (
        <div className='w-full'>
          <div className='section-wrapper section-table'>
            <LeavesInfo userId={userId} />
          </div>
        </div>
      )
    }

    const update = {
      value: 'update',
      label: 'Daily Update',
      content: (
        <div className='section-wrapper mt-30'>
          {updatedDataLoading ? (
            <div className='leave-wrapper pl-0 pt-11 w-full'>
              <CardHeader className='them-color' title={<span style={{ width: 'fit-content' }}>Daily Update</span>} />
              <div className='mt-50 mb-90 d-flex align-center justify-center'>
                <Loader />
              </div>
            </div>
          ) : (
            <DailyInfo
              grid={6}
              isUserProfile
              withProjectInfo
              dailyInfo={projectUpdate}
              handleSave={handleSaveUpdate}
              handleDelete={handleDeleteUpdate}
            />
          )}
        </div>
      )
    }

    if (isAccessToEdit) {
      {
        /*TODO: Add 'update' key in array to display update info */
      }

      return [profile, projects, attendance, leaves]
    }

    {
      /*TODO: Add 'update' key in array to display update info */
    }

    return [projects]
  }, [userData, userId, isAccessToEdit, handleUpdate])

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className='p-10'>
            <EmployeeDetails isAccessToEdit={isAccessToEdit} userData={userData} handleSave={handleSave} />
          </div>
          <div>
            <Box sx={{ width: '100%', typography: 'body1' }}>
              <Tabs value={value} handleChange={handleChange} className='emp-detail-tabs' tabList={tabList} />
            </Box>
          </div>
          {isAdmin && (
            <div className='d-flex justify-end mt-30 mr-10'>
              <CustomButton variant='outlined' fullWidth={false} color='error' onClick={handleSetDelete}>
                Deactivate Employee
              </CustomButton>
            </div>
          )}
          {!!deleteId && (
            <RemoveWarningModal
              customButtonProps={{ loading: deleteLoading }}
              message='Are you sure?'
              onClose={handleCloseDelete}
              onConfirm={handleDeleteEmployee}
              confirmButtonText='Deactivate'
              subtitle='Do you really want to deactivate an employee?'
            />
          )}
        </div>
      )}
    </>
  )
}

export async function getServerSideProps(props) {
  const id = getCookie('token', props)
  if (!id) {
    return {
      redirect: {
        destination: loginUrl
      }
    }
  }

  return {
    props: {}
  }
}

export default EmployeeProfile
