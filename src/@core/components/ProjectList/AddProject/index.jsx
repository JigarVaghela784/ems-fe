import React, { useEffect, useMemo, useState } from 'react'
import CustomModal from '../../../layouts/components/shared-components/CustomModal'
import CustomInput from '../../../../components/CustomInput'
import CustomButton from '../../../layouts/components/shared-components/CustomButton'
import CustomDatePicker from '../../../layouts/components/shared-components/CustomDatePicker'
import Grid from '@mui/material/Grid'
import CustomSelect from '../../../layouts/components/shared-components/CustomSelect'
import { CircleSlice8 } from 'mdi-material-ui'
import { useUserStore } from '../../../../store/user'
import { Axios } from '../../../../../api/axios'
import { getUserRoles, userRole } from '../../../../../utils/helper'
import dayjs from 'dayjs'

const { ADMIN, PROJECT_OWNER, EMPLOYEE, HR, PROJECT_MANAGER, TEAM_LEADER } = userRole

const AddProject = ({
  isOpenModal,
  handleCloseModal,
  project,
  setProject,
  loading,
  handleSave,
  editAccessUserRoles = [ADMIN, PROJECT_OWNER, EMPLOYEE, HR, PROJECT_MANAGER, TEAM_LEADER],
  projectUserInfo
}) => {
  const [getUserLoading, setGetUserLoading] = useState(false)
  const { user, allUser, setAllUser } = useUserStore()

  const { isAdmin } = getUserRoles(user?.role)

  useEffect(() => {
    if (!(allUser.length > 0)) {
      setGetUserLoading(true)
      Axios.get('user/all?pageSize=0')
        .then(data => {
          setAllUser(data.data)
        })
        .finally(() => {
          setGetUserLoading(false)
        })
    }
  }, [allUser.length, setAllUser])

  const userList = useMemo(() => {
    return allUser
      ?.filter(u => ![userRole.HR].includes(u.role) && u.employeeStatus === 'active')
      ?.map(u => {
        return {
          label: u.name,
          value: u.id
        }
      })
  }, [allUser])

  const handleDateChange = (name, value) => {
    setProject({ ...project, [name]: value.toISOString() })
  }

  const createdDate = project.createdDate ? new Date(project.createdDate) : null
  const deadlineDate = project.deadlineDate ? new Date(project.deadlineDate) : null

  const inputsEditAccess = !projectUserInfo ? true : editAccessUserRoles.includes(projectUserInfo?.role)

  const isProjectDateValid = dayjs(project.createdDate).isAfter(project.deadlineDate)

  return (
    <CustomModal
      open={true}
      handleClose={handleCloseModal}
      width={800}
      title={`${isOpenModal.name === 'edit' ? 'Edit Project' : 'Create Project'}`}
      className='project-form scrollbar-css'
    >
      <div className='project-form-wrapper'>
        <form>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} sm={12}>
              <CustomInput
                autoFocus
                fullWidth
                id='name'
                label='Project name'
                sx={{ marginBottom: 4 }}
                value={project.name}
                onChange={e => {
                  if (inputsEditAccess) setProject({ ...project, name: e.target.value })
                }}
                disabled={!inputsEditAccess}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <Grid container spacing={4}>
                {/*<Grid item xs={12} md={6} sm={6}>*/}
                {/*  <CustomInput*/}
                {/*    fullWidth*/}
                {/*    id='cost'*/}
                {/*    label='Cost'*/}
                {/*    sx={{ marginBottom: 4 }}*/}
                {/*    value={project.cost}*/}
                {/*    onChange={e => {*/}
                {/*      if (inputsEditAccess) setProject({ ...project, cost: e.target.value })*/}
                {/*    }}*/}
                {/*    disabled={!inputsEditAccess}*/}
                {/*  />*/}
                {/*</Grid>*/}
                <Grid item xs={12} md={12} sm={12}>
                  <CustomInput
                    fullWidth
                    id='weeklyHours'
                    label='Weekly hours'
                    sx={{ marginBottom: 4 }}
                    value={project.weeklyHours}
                    onChange={e => {
                      if (inputsEditAccess) setProject({ ...project, weeklyHours: e.target.value })
                    }}
                    disabled={!inputsEditAccess}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <CustomDatePicker
                label='Created date'
                value={createdDate ? dayjs(createdDate) : null}
                onChange={newValue => {
                  if (inputsEditAccess) handleDateChange('createdDate', newValue)
                }}
                disabled={!inputsEditAccess}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <CustomDatePicker
                value={deadlineDate ? dayjs(deadlineDate) : null}
                label='Deadline date'
                onChange={e => {
                  if (inputsEditAccess) handleDateChange('deadlineDate', e)
                }}
                minDate={dayjs(project?.createdDate || new Date()).add(0, 'day')}
                disabled={!inputsEditAccess}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <CustomSelect
                title='Priority'
                options={[
                  {
                    value: 'High',
                    name: 'Highest priority',
                    icons: <CircleSlice8 style={{ color: 'red', fontSize: 16, marginRight: '5px' }} />
                  },
                  {
                    value: 'Normal',
                    name: 'Normal priority',
                    icons: <CircleSlice8 style={{ color: '#1883C2', fontSize: 16, marginRight: '5px' }} />
                  },
                  {
                    value: 'Low',
                    name: 'Low priority',
                    icons: <CircleSlice8 style={{ color: 'green', fontSize: 16, marginRight: '5px' }} />
                  }
                ]}
                value={project.priority}
                onChange={e => {
                  if (inputsEditAccess) setProject({ ...project, priority: e.target.value })
                }}
                disabled={!inputsEditAccess}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <CustomSelect
                title='Status'
                options={[
                  {
                    value: 'Pending',
                    name: 'Pending'
                  },
                  {
                    value: 'Working',
                    name: 'Working'
                  },
                  {
                    value: 'Completed',
                    name: 'Completed'
                  }
                ]}
                value={project.status}
                onChange={e => {
                  if (inputsEditAccess) setProject({ ...project, status: e.target.value })
                }}
                disabled={!inputsEditAccess}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomInput
                fullWidth
                id='description'
                label='Description'
                sx={{ marginBottom: 4 }}
                multiline
                rows={4}
                value={project.description}
                onChange={e => {
                  if (inputsEditAccess) setProject({ ...project, description: e.target.value })
                }}
                disabled={!inputsEditAccess}
              />
            </Grid>

            <Grid item xs={12} md={6} sm={6}>
              <CustomSelect
                multiple
                title='Project owner'
                disabled={getUserLoading || (!editAccessUserRoles.includes(PROJECT_OWNER) && !isAdmin)}
                options={userList}
                value={project.project_owner || []}
                onChange={val => setProject({ ...project, project_owner: val })}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <CustomSelect
                multiple
                title='Project manager'
                options={userList}
                disabled={getUserLoading || (!editAccessUserRoles.includes(PROJECT_MANAGER) && !isAdmin)}
                value={project.project_manager || []}
                onChange={val => setProject({ ...project, project_manager: val })}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <CustomSelect
                multiple
                title='Team leader'
                options={userList}
                disabled={getUserLoading || (!editAccessUserRoles.includes(TEAM_LEADER) && !isAdmin)}
                value={project.team_leader || []}
                onChange={val => setProject({ ...project, team_leader: val })}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
              <CustomSelect
                multiple
                title='Project employees'
                options={userList}
                disabled={getUserLoading || (!editAccessUserRoles.includes(EMPLOYEE) && !isAdmin)}
                value={project.employee || []}
                onChange={val => {
                  setProject({ ...project, employee: val })
                }}
              />
            </Grid>
          </Grid>

          <CustomButton
            fullWidth
            size='large'
            loading={loading}
            variant='contained'
            sx={{ marginBottom: 7, marginTop: 12, minWidth: '200px' }}
            disabled={!project.name || isProjectDateValid}
            onClick={handleSave}
            loadingProps={{ size: 26 }}
          >
            {isOpenModal.name === 'edit' ? 'Save' : 'Submit'}
          </CustomButton>
        </form>
      </div>
    </CustomModal>
  )
}

export default AddProject
