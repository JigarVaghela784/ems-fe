import React, { useEffect, useMemo, useRef, useState } from 'react'
import CustomTable from '../../../layouts/components/shared-components/CustomTable'
import CustomRemoveModal from '../../../layouts/components/shared-components/CustomRemoveModal'
import CustomSelect from '../../../layouts/components/shared-components/CustomSelect'
import CustomBreadcrumb from '../../../layouts/components/shared-components/CustomBreadcrumb'
import LeaveForm from '../LeaveForm'
import SearchLeave from '../SearchLeave'
import ActionMenu from '../ActionMenu'
import { Box, Container, Tooltip } from '@mui/material'
import { getFormattedDate, getUserRoles } from 'utils/helper'
import { statusList } from '../../../../../utils/helper'
import { useUserStore } from '../../../../store/user'
import dayjs from 'dayjs'
import { useLeavesStore } from '../../../../store/leaves'
import { Axios } from '../../../../../api/axios'
import CustomButton from '../../../layouts/components/shared-components/CustomButton'
import Tabs from '../../../../components/Tabs'
import { toast } from 'react-toastify'
import Loader from 'src/components/Loader'
import { useRouter } from 'next/router'
import { useDebounce } from '../../../../hooks/useDebounce'
import useWindowSize from '../../../../hooks/useWindowSize'

const LeavesInfo = ({ userId, isEditMode }) => {
  const { user, pagination, setPagination } = useUserStore()
  const { setLeaves, leaves } = useLeavesStore()

  const { isEmployee: isEmpRole, isHR, isProjectOwner, isProjectManager, isTeamLeader } = getUserRoles(user.role)

  const isEmployee = isEmpRole || isProjectOwner || isProjectManager || isTeamLeader

  const router = useRouter()
  const { pathname, query } = router
  const { employeeName, leaveType, from, to, page = 1, pageSize = 10, activeType: activeTypeFromUrl } = query
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [selectedRowValue, setSelectedRowValue] = useState({})
  const [tableRows, setTableRows] = useState([])
  const [isOpenModal, setIsOpenModal] = useState({ open: false, name: '' })
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState()
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false)
  const [activeType, setActiveType] = useState(activeTypeFromUrl || 'active')
  const [paginationLoading, setPaginationLoading] = useState(false)
  const [isChangeFilter, setIsChangeFilter] = useState(false)
  const searchEmployeeName = employeeName ? decodeURIComponent(employeeName) : ''
  const searchLeaveType = leaveType ? decodeURIComponent(leaveType) : ''
  const fromStartDate = from ? decodeURIComponent(from) : ''
  const toEndDate = to ? decodeURIComponent(to) : ''

  const [searchData, setSearchData] = useState({
    employeeName: searchEmployeeName,
    leaveType: searchLeaveType,
    fromStartDate: fromStartDate,
    toEndDate: toEndDate
  })
  const searchNameDebounce = useDebounce(searchData.employeeName, 1000)

  useEffect(() => {
    const param = { ...query }
    if (searchData.employeeName) {
      param.employeeName = encodeURIComponent(searchData.employeeName)
    } else {
      delete param['employeeName']
    }
    if (searchData.leaveType) {
      param.leaveType = encodeURIComponent(searchData.leaveType)
    } else {
      delete param['leaveType']
    }
    if (searchData.fromStartDate) {
      param.from = encodeURIComponent(searchData.fromStartDate)
    } else {
      delete param['from']
    }
    if (searchData.toEndDate) {
      param.to = encodeURIComponent(searchData.toEndDate)
    } else {
      delete param['to']
    }
    router.push(
      {
        pathname,
        query: { ...param, page: isChangeFilter ? 1 : param.page || 1 }
      },
      undefined,
      {
        shallow: true
      }
    )
  }, [searchNameDebounce, searchData.leaveType, searchData.fromStartDate, searchData.toEndDate])

  const tableRowsRef = useRef()
  const { width } = useWindowSize()
  const pinnedColumns = width >= 768 ? { left: ['employeeName'] } : {}

  const handleChange = (event, newValue) => {
    setActiveType(newValue)

    router.push(
      {
        pathname,
        query: { ...query, activeType: newValue, page: 1 }
      },
      undefined,
      {
        shallow: true
      }
    )
  }

  useEffect(() => {
    setLoading(true)
    setPaginationLoading(true)
    let url = ''

    if (isEditMode) {
      url = `leave/allUser`
    } else {
      url = `leave/`
    }
    url += `?status=${activeType}`
    if (employeeName) {
      url += `&employeeName=${employeeName}`
    }
    if (leaveType) {
      url += `&leaveType=${leaveType}`
    }
    if (from) {
      url += `&from=${from}`
    }
    if (to) {
      url += `&to=${to}`
    }
    if (userId) {
      url += `&userId=${userId}`
    }

    url += `&page=${page}&pageSize=${pageSize || 10}`

    Axios.get(url)
      .then(data => {
        if (data.data.length > 0) {
          setLeaves(data.data)
        } else {
          setLeaves([])
        }
        setPagination(data.meta)
      })
      .catch(error => {
        toast.error(error.message)
      })
      .finally(() => {
        setLoading(false)
        setPaginationLoading(false)
      })
  }, [activeType, employeeName, leaveType, from, to, page, pageSize])

  useEffect(() => {
    if (leaves.loading) return
    tableRowsRef.current = tableRows
  }, [tableRows])

  const updatedLeavesList = useMemo(() => {
    if (!leaves.loading) {
      let leavesData = leaves?.map(leave => {
        return {
          ...leave,
          employeeName: leave.employeeName || leave.user.name,
          from: getFormattedDate(leave.from, 'DD MMM, YYYY'),
          to: getFormattedDate(leave.to, 'DD MMM, YYYY')
        }
      })

      return leavesData
    } else {
      return []
    }
  }, [leaves, searchData])

  useEffect(() => {
    setTableRows(updatedLeavesList)
  }, [updatedLeavesList])

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const initialUserState = {
    empId: '',
    leaveType: '',
    from: null,
    to: null,
    noOfDay: 0,
    reason: '',
    status: ''
  }

  const [userData, setUserData] = useState(initialUserState)

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await Axios.delete(`leave/delete/${selectedRowValue.id}`)
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
    }
    const updatedData = tableRows?.filter(user => user.id !== selectedRowValue.id)
    setTableRows(updatedData)
    setLeaves(updatedData)
    setIsOpenRemoveModal(!isOpenRemoveModal)
    toast.success('Leave deleted successfully')
    setDeleteLoading(false)
  }

  const handleSelect = async (params, value) => {
    const updateValue = tableRowsRef.current.map(d => (d.id === params.id ? { ...d, status: value } : { ...d }))
    setTableRows(updateValue)
    const { row = {} } = params
    const { createdTime, employeeName, from, to, ...payload } = row || {}
    try {
      await Axios.patch('leave/update', {
        ...payload,
        from: getFormattedDate(from),
        to: getFormattedDate(to),
        status: value
      })
      toast.success('Leave updated successfully')
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
    }
  }

  const handlePaginationModelChange = params => {
    router.push(
      {
        pathname,
        query: {
          ...query,
          pageSize: params.pageSize,
          page: params.page + 1
        }
      },
      undefined,
      {
        shallow: true
      }
    )
  }

  const updatedTableRows = useMemo(() => {
    return tableRows || []
  }, [tableRows, searchData])

  const columns = useMemo(() => {
    const col = [
      {
        field: 'leaveType',
        headerName: 'Leave Type',
        width: 150,
        editable: false
      },
      {
        field: 'reason',
        headerName: 'Reason',
        width: 250,
        renderCell: params => {
          return (
            <Tooltip placement='bottom-start' title={params.formattedValue}>
              <div className='ellipsis'>{params.formattedValue}</div>
            </Tooltip>
          )
        },
        editable: false
      },
      {
        field: 'from',
        headerName: 'From',
        width: 150,
        editable: false
      },
      {
        field: 'to',
        headerName: 'To',
        width: 150,
        editable: false
      },
      {
        field: 'noOfDay',
        headerName: 'No. of Days',
        width: 100,
        editable: false
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 200,
        renderCell: params => {
          if (isEditMode)
            return (
              <Box>
                {
                  <CustomSelect
                    style={{ fontSize: '0.875rem' }}
                    id='status'
                    options={statusList}
                    className='LeaveApprovalStatus'
                    defaultValue={params.row.status || 'pending'}
                    value={params.row.status || 'pending'}
                    handleChange={({ target: { value } }) => handleSelect(params, value)}
                  />
                }
              </Box>
            )

          if (isEmployee || !!userId) {
            const statusVal = statusList.find(s => s.value === (params.formattedValue || 'pending'))

            return (
              <div className='d-flex align-center'>
                {statusVal?.icons}
                <span className='pl-2'>{statusVal?.name}</span>
              </div>
            )
          }

          return (
            <Box>
              {
                <CustomSelect
                  style={{ fontSize: '0.875rem' }}
                  id='status'
                  options={statusList}
                  className='LeaveApprovalStatus'
                  defaultValue={params.row.status || 'pending'}
                  value={params.row.status || 'pending'}
                  handleChange={({ target: { value } }) => handleSelect(params, value)}
                />
              }
            </Box>
          )
        }
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 100,
        renderCell: params => (
          <ActionMenu
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            handleDropdownOpen={handleDropdownOpen}
            isOpenModal={isOpenModal}
            setIsOpenModal={setIsOpenModal}
            tableRows={tableRowsRef.current}
            selectedRowValue={selectedRowValue}
            setUserData={setUserData}
            isOpenRemoveModal={isOpenRemoveModal}
            setIsOpenRemoveModal={setIsOpenRemoveModal}
            params={params}
            isEmployee={!isEditMode}
          />
        )
      }
    ]

    if (isEditMode) {
      col.splice(0, 0, {
        field: 'employeeName',
        headerName: 'Employee',
        width: 200,
        editable: false
      })
    }

    return col
  }, [isEmployee])

  const handleCloseModal = type => {
    if (type === 'saveData') {
      setActiveType(userData.status || 'pending')
    }
    setIsOpenModal({ open: !isOpenModal.open, name: 'edit' })
    setUserData(initialUserState)
  }

  const filterData = type => {
    return updatedTableRows.filter(d => d.status === type)
  }

  const tableProps = {
    columns: columns,
    onRowClick: params => {
      setSelectedRowValue(params.row)
    },
    onPaginationModelChange: handlePaginationModelChange,
    paginationModel: {
      pageSize: +(pagination.pageSize || 10),
      page: page ? page - 1 : 0
    },
    rowCount: pagination?.total,
    loading: paginationLoading,
    paginationMode: 'server',
    pinnedColumns: pinnedColumns
  }

  return (
    <>
      {!!userId ? (
        <div className='leave-section-wrapper'>
          <div className='title'>Leaves</div>
          {loading ? (
            <Loader />
          ) : (
            <div className='leave-wrapper'>
              <SearchLeave
                isEmployee={!isEditMode}
                searchEmployeeData={searchData}
                searchData={searchData}
                setSearchData={setSearchData}
                setIsChangeFilter={setIsChangeFilter}
              />
              <CustomTable rows={updatedTableRows} {...tableProps} />
            </div>
          )}
        </div>
      ) : (
        <Box sx={{ width: '100%', display: 'flex', flexFlow: 'column' }}>
          <Box>
            <CustomBreadcrumb title='Leaves' BreadcrumbTitle='Leaves'>
              <CustomButton
                fullWidth={false}
                sx={{ minWidth: '200px' }}
                onClick={() => {
                  setIsOpenModal({ open: !isOpenModal.open, name: 'add' })
                }}
              >
                Add Leave
              </CustomButton>
            </CustomBreadcrumb>
          </Box>
          <Container>
            <div className='leave-wrapper mt-24'>
              <SearchLeave
                isEmployee={!isEditMode}
                searchEmployeeData={searchData}
                searchData={searchData}
                setSearchData={setSearchData}
                setIsChangeFilter={setIsChangeFilter}
              />
              <Tabs
                value={activeType}
                handleChange={handleChange}
                className='leave-tabs'
                tabList={[
                  {
                    value: 'active',
                    label: 'Approved',
                    content: (
                      <div className='mt-20'>
                        <CustomTable rows={filterData('active')} {...tableProps} />
                      </div>
                    )
                  },
                  {
                    value: 'pending',
                    label: 'Pending',
                    content: (
                      <div className='mt-20'>
                        <CustomTable rows={filterData('pending')} {...tableProps} />
                      </div>
                    )
                  },
                  {
                    value: 'inactive',
                    label: 'Declined',
                    content: (
                      <div className='mt-20'>
                        <CustomTable rows={filterData('inactive')} {...tableProps} />
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </Container>
        </Box>
      )}
      {isOpenModal.open && (
        <LeaveForm
          isOpenModal={isOpenModal}
          handleCloseModal={handleCloseModal}
          setTableRows={setTableRows}
          tableRows={tableRows}
          userData={userData}
          setUserData={setUserData}
          selectedRowValue={selectedRowValue}
          setLeaves={setLeaves}
          leaves={leaves}
          isEmployee={!isEditMode}
          setActiveType={setActiveType}
        />
      )}
      {isOpenRemoveModal && (
        <CustomRemoveModal
          open={isOpenRemoveModal}
          handleClose={() => {
            setAnchorEl(null)
            setIsOpenRemoveModal(!isOpenRemoveModal)
          }}
          title='Delete Leave'
          description='Are you sure want to delete this leave?'
          onConfirm={handleDelete}
          deleteLoading={deleteLoading}
        />
      )}
    </>
  )
}

export default LeavesInfo
