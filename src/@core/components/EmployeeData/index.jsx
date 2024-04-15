import React, { useEffect, useMemo, useState } from 'react'
import { Container } from '@mui/material'
import CustomTable from '../../layouts/components/shared-components/CustomTable'
import CustomSelect from '../../layouts/components/shared-components/CustomSelect'
import dayjs from 'dayjs'
import { userStatus } from '../../../@core/constant/User'
import { Axios } from 'api/axios'
import { useUserStore } from 'src/store/user'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { getStatusColor } from '../../../../utils/helper'
import useWindowSize from '../../../hooks/useWindowSize'

const EmployeeData = ({ employeeData, viewOnly, handlePaginationModelChange, pagination, paginationLoading }) => {
  const [tableRows, setTableRows] = useState([])
  const { allUser, setAllUser } = useUserStore()
  const { width } = useWindowSize()
  const pinnedColumns = width >= 768 ? { left: ['index', 'name'] } : {}

  const pageSize = +(pagination.pageSize || 10)
  const page = pagination?.page ? pagination?.page - 1 : 0

  const router = useRouter()
  useEffect(() => {
    setTableRows(employeeData)
  }, [employeeData])

  const tableRowsUpdated = tableRows.map((row, index) => ({
    ...row,
    index: index + 1 + page * pageSize
  }))

  const handleSelect = (params, value) => {
    const updatedStatus = allUser.map(d => (d.id === params.id ? { ...d, employeeStatus: value } : { ...d }))
    setAllUser(updatedStatus)
    const { row = {} } = params
    const { employeeStatus, ...payload } = row || {}
    Axios.patch('user/edit', { ...payload, employeeStatus: value }).then(() => {
      toast.success('User details updated successfully')
    })
  }

  const updatedTableRows = useMemo(() => {
    return tableRowsUpdated || []
  }, [tableRowsUpdated])

  const commonCellRenderer = text => {
    return <div>{text ? text : '-'}</div>
  }

  const columns = [
    { field: 'index', headerName: '#', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: false,
      renderCell: ({ row: { id, name } }) => {
        return (
          <div
            className='cursor-pointer text-link'
            onClick={() => {
              router.push({
                pathname: '/employee-profile',
                query: { userId: id }
              })
            }}
          >
            {name}
          </div>
        )
      }
    },
    {
      field: 'designation',
      headerName: 'Designation',
      width: 250,
      editable: false,
      renderCell: ({ row: { designation } }) => commonCellRenderer(designation)
    },

    {
      field: 'email',
      headerName: 'Email',
      width: 250,
      editable: false,
      renderCell: ({ row: { email } }) => commonCellRenderer(email)
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 200,
      editable: false,
      renderCell: ({ row: { phone } }) => commonCellRenderer(phone)
    },
    {
      field: 'role',
      headerName: 'Roles',
      width: 200,
      editable: false,
      renderCell: ({ row: { role } }) => commonCellRenderer(role)
    },
    {
      field: 'dob',
      headerName: 'Date of Birth',
      width: 200,
      editable: false,
      renderCell: ({ row: { dob } }) => {
        const formattedDate = dob ? dayjs(dob).format('D MMM, YYYY') : '-'

        return commonCellRenderer(formattedDate)
      }
    }
  ]
  if (!viewOnly) {
    columns.splice(3, 0, {
      field: 'employeeStatus',
      headerName: 'Status',
      width: 200,
      editable: false,
      renderCell: params => {
        return (
          <div>
            <CustomSelect
              style={{ fontSize: '0.875rem' }}
              id='status'
              options={userStatus}
              className='employee-status'
              value={params.row.employeeStatus}
              handleChange={({ target: { value } }) => handleSelect(params, value)}
            />
          </div>
        )
      }
    })
  }

  return (
    <div className='leave-wrapper mt-20 mt-30'>
      <CustomTable
        columns={columns}
        rows={updatedTableRows}
        onPaginationModelChange={handlePaginationModelChange}
        rowCount={pagination?.total}
        loading={paginationLoading}
        pinnedColumns={pinnedColumns}
        paginationMode='server'
        paginationModel={{
          pageSize: pageSize,
          page: page
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: +(pagination.pageSize || 10), page: (pagination?.page || 1) - 1 }
          }
        }}
      />
    </div>
  )
}

export default EmployeeData
