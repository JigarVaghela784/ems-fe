import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import CustomTable from 'src/@core/layouts/components/shared-components/CustomTable'
import { getRoleMembers } from 'utils/helper'
import AvatarGroup from '../../../../components/AvatarGroup'
import useWindowSize from '../../../../hooks/useWindowSize'
import { Avatar } from '@mui/material'

const ProjectData = ({ filteredProjects }) => {
  const router = useRouter()
  const [tableRows, setTableRows] = useState([])

  const { width } = useWindowSize()
  const pinnedColumns = width >= 768 ? { left: ['index', 'name'] } : {}

  useEffect(() => {
    setTableRows(filteredProjects)
  }, [filteredProjects])

  const tableRowsUpdated = tableRows.map((row, index) => ({ ...row, index: index + 1 }))

  const updatedTableRows = useMemo(() => {
    return tableRowsUpdated || []
  }, [tableRowsUpdated])

  const columns = [
    { field: 'index', headerName: '#', width: 90 },
    {
      field: 'name',
      headerName: 'Project Name',
      width: 250,
      editable: false,
      renderCell: params => {
        return (
          <div
            className='cursor-pointer text-link'
            onClick={() => {
              router.push({
                pathname: `projects/${params.row.id}`
              })
            }}
          >
            {params.row.name}
          </div>
        )
      }
    },
    {
      field: '1',
      headerName: 'Project Owner',
      width: 180,
      editable: false,
      renderCell: params => {
        const employeesData = params.row.employees

        const roleMembers = getRoleMembers(employeesData)

        return Object.keys(roleMembers).map(role => {
          if (role !== 'project_owner') {
            return
          }

          const updateList = roleMembers[role].map(d => {
            return { ...d, name: d.employee.name }
          })

          return (
            <div key={role}>
              <AvatarGroup list={updateList} withLink />
            </div>
          )
        })
      }
    },
    {
      field: '2',
      headerName: 'Project Manager',
      width: 180,
      editable: false,
      renderCell: params => {
        const employeesData = params.row.employees

        const roleMembers = getRoleMembers(employeesData)

        return Object.keys(roleMembers).map(role => {
          if (role !== 'project_manager') {
            return
          }

          const updateList = roleMembers[role].map(d => {
            return { ...d, name: d.employee.name }
          })

          return (
            <div key={role}>
              <AvatarGroup list={updateList} withLink />
            </div>
          )
        })
      }
    },
    {
      field: '3',
      headerName: 'Team Leader',
      width: 180,
      editable: false,
      renderCell: params => {
        const employeesData = params.row.employees

        const roleMembers = getRoleMembers(employeesData)

        return Object.keys(roleMembers).map(role => {
          if (role !== 'team_leader') {
            return
          }

          const updateList = roleMembers[role].map(d => {
            return { ...d, name: d.employee.name }
          })

          return (
            <div key={role}>
              <AvatarGroup list={updateList} withLink />
            </div>
          )
        })
      }
    },
    {
      field: '4',
      headerName: 'Employee',
      width: 180,
      editable: false,
      renderCell: params => {
        const employeesData = params.row.employees

        const roleMembers = getRoleMembers(employeesData)
        const totalEmployees = roleMembers['employee']?.length || 0

        return Object.keys(roleMembers).map(role => {
          if (role !== 'employee') {
            return
          }

          const updateList = roleMembers[role].map(d => {
            return { ...d, name: d.employee.name }
          })
          const showAvatar = totalEmployees >= 4
          const displayList = showAvatar ? updateList.slice(0, 2) : updateList

          return (
            <div key={role} className='employee-number'>
              <AvatarGroup list={displayList} withLink />
              {showAvatar && <Avatar className='rest-employee'>+{totalEmployees - 2}</Avatar>}
            </div>
          )
        })
      }
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 150,
      editable: false,
      renderCell: params => <div>{params.row.priority ? params.row.priority : '-'}</div>
    }
  ]

  return (
    <div className='leave-wrapper project-list'>
      <CustomTable className='project-table' columns={columns} rows={updatedTableRows} pinnedColumns={pinnedColumns} />
    </div>
  )
}

export default ProjectData
