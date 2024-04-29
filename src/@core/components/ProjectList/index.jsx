import React, { useEffect, useMemo, useState } from 'react'
import ProjectFilter from './ProjectFilter'
import ProjectCard from './ProjectCard'
import Grid from '@mui/material/Grid'
import CustomButton from '../../layouts/components/shared-components/CustomButton'
import CustomBreadcrumb from '../../layouts/components/shared-components/CustomBreadcrumb'
import { useUserStore } from '../../../store/user'
import { convertToObject, getUserRoles, TabViewType } from '../../../../utils/helper'
import AddProject from './AddProject'
import { Axios } from '../../../../api/axios'
import { useProjectStore } from 'src/store/project'
import NoData from '../../../components/NoData'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import ProjectData from './ProjectData'
import { useDebounce } from 'src/hooks/useDebounce'
import { useRouter } from 'next/router'
import { Container } from '@mui/material'

const ProjectList = ({ showBreadCrumb = true, userId }) => {
  const router = useRouter()
  const { query, pathname } = router
  const { tab, projectName, employee } = query
  const { user } = useUserStore()
  const { isEmployee } = getUserRoles(user.role)
  const { projectList, setProjectList } = useProjectStore()
  const [isOpenModal, setIsOpenModal] = useState({ open: false, id: null })
  const [project, setProject] = useState({})
  const [loading, setLoading] = useState(false)
  const searchProjectName = projectName ? decodeURIComponent(projectName) : ''
  const searchEmployee = employee ? decodeURIComponent(employee) : ''
  const [filterProjectName, setFilterProjectName] = useState(searchProjectName || '')
  const [filterEmployeeName, setFilterEmployeeName] = useState(searchEmployee || '')
  const [isGrid, setIsGrid] = useState(false)
  const projectNameDebounce = useDebounce(filterProjectName, 1000)
  useEffect(() => {
    setLoading(true)
    const url = userId ? `project?userId=${userId}` : 'project'
    Axios.get(url).then(p => {
      if (p) {
        setProjectList(p)
      } else {
        setProjectList([])
      }
      setLoading(false)
    })
  }, [userId, setProjectList])

  const handleCloseModal = () => {
    setIsOpenModal({ open: false, id: null })
    setProject({ createdDate: '', deadlineDate: '' })
  }

  const handleSave = async () => {
    setLoading(true)
    const formattedData = convertToObject(project)
    try {
      const newProject = await Axios.post('project/add', formattedData)
      toast.success('Project added successfully')
      setProjectList([...projectList, newProject])
      handleCloseModal()
      setProject({})
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = useMemo(() => {
    return projectList.filter(projectName => {
      const projectMatch = projectName.name
        ? projectName.name.toLowerCase().includes(filterProjectName.toLowerCase())
        : true

      const employeeMatch =
        filterEmployeeName.length > 0
          ? projectName.employees.find(emp => {
              return filterEmployeeName.includes(emp.employeeId)
            })
          : true

      return projectMatch && employeeMatch
    })
  }, [filterProjectName, filterEmployeeName, projectList])

  const handleView = isGrid => {
    setIsGrid(isGrid)
    router.push(
      {
        pathname,
        query: { ...query, tab: isGrid ? TabViewType.GRID : TabViewType.TABLE }
      },
      undefined,
      {
        shallow: true
      }
    )
  }

  useEffect(() => {
    setIsGrid(tab === TabViewType.GRID)
  }, [tab])

  useEffect(() => {
    const param = { ...query }
    if (filterProjectName) {
      param.projectName = encodeURIComponent(filterProjectName)
    } else {
      delete param['projectName']
    }
    if (filterEmployeeName) {
      param.employee = encodeURIComponent(filterEmployeeName)
    } else {
      delete param['employee']
    }
    setTimeout(() => {
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
    }, 1000)
  }, [projectNameDebounce, filterEmployeeName, filterProjectName])

  return (
    <div className='w-full'>
      {showBreadCrumb && (
        <CustomBreadcrumb title='Projects' BreadcrumbTitle='Projects'>
          {!isEmployee && (
            <CustomButton
              fullWidth={false}
              sx={{ minWidth: '200px' }}
              onClick={() => {
                setIsOpenModal({ open: !isOpenModal.open, id: null })
              }}
            >
              Add Project
            </CustomButton>
          )}
        </CustomBreadcrumb>
      )}
      <div>
        {loading ? (
          <Loader />
        ) : (
          <Container>
            <div className='leave-wrapper mt-24 attendance-admin-wrapper project-data'>
              <ProjectFilter
                projectList={projectList}
                filterEmployeeName={filterEmployeeName}
                filterProjectName={filterProjectName}
                setFilterEmployeeName={setFilterEmployeeName}
                setFilterProjectName={setFilterProjectName}
                handleView={handleView}
                searchProject
                isGrid={isGrid}
              />

              {!isGrid ? (
                <div>
                  <ProjectData filteredProjects={filteredProjects} />
                </div>
              ) : filteredProjects.length ? (
                <div className='mt-20 project-card-wrapper project-list'>
                  <Grid container spacing={2}>
                    {filteredProjects.map(project => (
                      <Grid item xs={12} md={6} lg={4} key={project.id}>
                        <ProjectCard project={project} />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ) : (
                <NoData description={'No project found!'} />
              )}
            </div>
          </Container>
        )}
      </div>

      {isOpenModal.open && (
        <AddProject
          project={project}
          setProject={setProject}
          handleCloseModal={handleCloseModal}
          isOpenModal={isOpenModal}
          loading={loading}
          handleSave={handleSave}
        />
      )}
    </div>
  )
}

export default ProjectList
