import React, { useEffect, useMemo, useState } from 'react'
import { Box, CardHeader, Container } from '@mui/material'
import CustomBreadcrumb from '../../../layouts/components/shared-components/CustomBreadcrumb'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import { useProjectStore } from '../../../../store/project'
import { Axios } from '../../../../../api/axios'
import { useRouter } from 'next/router'
import Loader from '../../../../components/Loader'
import { ProjectInfo } from './ProjectInfo'
import ProjectDetail from './ProjectDetail'
import RoleAssigned from './RoleAssigned'
import CustomButton from '../../../layouts/components/shared-components/CustomButton'
import AddProject from '../AddProject'
import { convertToObject, getRoleMembers, getUserRoles, userRole, userRoleValue } from '../../../../../utils/helper'
import { toast } from 'react-toastify'
import RemoveWarningModal from '../../../layouts/components/shared-components/RemoveWarningModal'
import { useUserStore } from '../../../../store/user'
import DailyInfo from '../../DailyUpdate/DailyInfo'
import { useProjectUpdateStore } from '../../../../store/projectupdate'
import dayjs from 'dayjs'

const ProjectDetails = () => {
  const { project, setProject } = useProjectStore()
  const router = useRouter()
  const { projectId } = router.query
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isOpenModal, setIsOpenModal] = useState({ open: false, id: projectId })
  const [editProjectInfo, setEditProjectInfo] = useState(null)
  const { user } = useUserStore()
  const { ADMIN, PROJECT_OWNER, EMPLOYEE, HR, PROJECT_MANAGER, TEAM_LEADER } = userRole
  const { isAdmin, isHR } = getUserRoles(user.role)
  const [updatedDataLoading, setUpdatedDataLoading] = useState(false)
  const { projectUpdate, setProjectUpdate } = useProjectUpdateStore()
  const { projectList } = useProjectStore()

  useEffect(() => {
    setLoading(true)
    Axios.get(`project/${projectId}`).then(p => {
      if (p) {
        setProject(p)
        setLoading(false)
      } else {
        router.push('/projects')
      }
    })

    setUpdatedDataLoading(true)
    Axios.get(`project-update?projectId=${projectId}`)
      .then(data => {
        setProjectUpdate(data.data)
      })
      .finally(() => setUpdatedDataLoading(false))
  }, [projectId, setProject, router])

  useEffect(() => {
    if (project) {
      const data = {
        project_owner: [],
        project_manager: [],
        team_leader: [],
        employee: []
      }
      project?.employees?.forEach(member => {
        data[member.role]?.push(member.employeeId)
      })

      setEditProjectInfo({ ...project, ...data })
    }
  }, [project])

  const handleSetDelete = () => setDeleteId(projectId)
  const handleCloseDelete = () => setDeleteId(null)

  const handleDeleteProject = () => {
    setDeleteLoading(true)
    Axios.delete(`project/${projectId}`)
      .then(r => {
        router.push('/projects')
        toast.success('Project deleted successfully')
      })
      .catch(() => {
        setDeleteLoading(false)
      })
  }

  const roleMembers = useMemo(() => {
    return getRoleMembers(project?.employees)
  }, [project?.employees])

  const handleCloseModal = () => {
    setIsOpenModal({ open: !isOpenModal.open, id: null })
  }

  const handleSave = async () => {
    setLoadingEdit(true)
    const formattedData = convertToObject(editProjectInfo)
    try {
      const updateData = await Axios.patch('project/edit', { ...formattedData, id: project.id })
      toast.success('Project updated successfully')
      setProject({ ...project, ...updateData })
      handleCloseModal()
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
    } finally {
      setLoadingEdit(false)
    }
  }

  const projectUserInfo = useMemo(() => {
    return project?.employees
      ?.filter(u => u.employeeId === user.id)
      .sort((a, b) => {
        return userRoleValue[a.role] - userRoleValue[b.role]
      })[0]
  }, [project?.employees, user.id])

  const editAccessUserRoles = useMemo(() => {
    const userInfo = projectUserInfo
    if (userInfo) {
      switch (userInfo.role) {
        case ADMIN:
          return [ADMIN, PROJECT_OWNER, PROJECT_MANAGER, TEAM_LEADER, EMPLOYEE]
        case PROJECT_OWNER:
          return [PROJECT_OWNER, PROJECT_MANAGER, TEAM_LEADER, EMPLOYEE]
        case PROJECT_MANAGER:
          return [PROJECT_MANAGER, TEAM_LEADER, EMPLOYEE]
        case TEAM_LEADER:
          return [EMPLOYEE]
        case EMPLOYEE:
        case HR:
        default:
          return []
      }
    }

    return []
  }, [projectUserInfo, ADMIN, HR, PROJECT_OWNER, PROJECT_MANAGER, TEAM_LEADER, EMPLOYEE])

  const handleChangeHrs = async (value, updateUser) => {
    const updateEmp = project?.employees?.map(u => {
      if (u.id === updateUser.id) {
        return { ...updateUser, hours: value }
      }

      return u
    })

    const data = { ...project, employees: updateEmp, id: project.id }
    try {
      const res = await Axios.patch('project/edit', data)
      setProject(res)
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
    }
  }

  const projectUpdateList = projectUpdate.reduce((prev, curr) => {
    let date = dayjs(curr.createdAt).format('ddd, D MMMM YYYY')
    if (!prev[date]) {
      prev[date] = []
    }

    prev[date].push(curr)

    return prev
  }, {})

  const handleAdd = (obj, type) => {
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

  const handleRemove = data => {
    setProjectUpdate(data)
  }

  return (
    <Box>
      <CustomBreadcrumb
        title={project?.name || 'Project Details'}
        extraLink={<Link href='/projects'>Project</Link>}
        BreadcrumbTitle={project?.name || 'Project Details'}
      >
        {!loading && ([ADMIN, PROJECT_OWNER, PROJECT_MANAGER].includes(projectUserInfo?.role) || isAdmin || isHR) && (
          <CustomButton
            style={{ width: 170 }}
            onClick={() => {
              setIsOpenModal({ open: !isOpenModal.open, id: projectId, name: 'edit' })
            }}
          >
            Edit project
          </CustomButton>
        )}
      </CustomBreadcrumb>
      <Container>
        {loading ? (
          <div className='leave-wrapper leave-wrapper-loading mt-30 d-flex align-center justify-center'>
            <Loader />
          </div>
        ) : (
          <>
            <div className='leave-wrapper mt-30'>
              <Grid container spacing={2}>
                <Grid item lg={8} md={7} xs={12}>
                  <ProjectInfo project={project} />
                  <Grid container spacing={2} mt={2}>
                    {Object.keys(roleMembers).map(role => {
                      return (
                        <Grid item lg={6} md={12} key={role} className='w-full'>
                          <RoleAssigned
                            role={role}
                            userList={roleMembers[role]}
                            editAccessUserRoles={editAccessUserRoles}
                            handleChangeHrs={handleChangeHrs}
                          />
                        </Grid>
                      )
                    })}
                  </Grid>

                  {/*TODO: Project daily update code ( Do not remove )*/}
                  {/*<div className='mt-10'>*/}
                  {/*  {updatedDataLoading ? (*/}
                  {/*    <div className='leave-wrapper pl-0 pt-11'>*/}
                  {/*      <CardHeader*/}
                  {/*        className='them-color'*/}
                  {/*        title={<span style={{ width: 'fit-content' }}>Daily Update</span>}*/}
                  {/*      />*/}
                  {/*      <div className='mt-50 mb-90 d-flex align-center justify-center'>*/}
                  {/*        <Loader />*/}
                  {/*      </div>*/}
                  {/*    </div>*/}
                  {/*  ) : (*/}
                  {/*    <DailyInfo*/}
                  {/*      projectId={projectId}*/}
                  {/*      grid={12}*/}
                  {/*      update={projectUpdateList}*/}
                  {/*      updatedData={projectUpdate}*/}
                  {/*      handleSave={handleAdd}*/}
                  {/*      handleDelete={handleRemove}*/}
                  {/*      dailyInfo={projectUpdate}*/}
                  {/*    />*/}
                  {/*  )}*/}
                  {/*</div>*/}
                </Grid>

                <Grid item lg={4} md={5} xs={12}>
                  <div className='sticky-section'>
                    <ProjectDetail project={project} />
                  </div>
                </Grid>
              </Grid>
            </div>

            {(isAdmin || projectUserInfo?.isProjectOwner) && (
              <div className='d-flex justify-end mt-16'>
                <CustomButton variant='outlined' fullWidth={false} color='error' onClick={handleSetDelete}>
                  Delete Project
                </CustomButton>
              </div>
            )}
          </>
        )}
      </Container>

      {!!deleteId && (
        <RemoveWarningModal
          customButtonProps={{ loading: deleteLoading }}
          message='Are you sure?'
          onClose={handleCloseDelete}
          onConfirm={handleDeleteProject}
        />
      )}

      {isOpenModal.open && (
        <AddProject
          project={editProjectInfo}
          setProject={setEditProjectInfo}
          handleCloseModal={handleCloseModal}
          isOpenModal={isOpenModal}
          loading={loadingEdit}
          handleSave={handleSave}
          editAccessUserRoles={editAccessUserRoles}
          projectUserInfo={projectUserInfo}
        />
      )}
    </Box>
  )
}

export default ProjectDetails
