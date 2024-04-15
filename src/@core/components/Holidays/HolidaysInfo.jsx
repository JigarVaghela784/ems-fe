import React, { useEffect, useState } from 'react'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import { Button, Container, Menu, MenuItem, Typography } from '@mui/material'
import dayjs from 'dayjs'
import Box from '@mui/material/Box'
import Pencil from 'mdi-material-ui/Pencil'
import TrashCanOutline from 'mdi-material-ui/TrashCanOutline'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import CustomTable from '../../layouts/components/shared-components/CustomTable'
import CustomRemoveModal from '../../layouts/components/shared-components/CustomRemoveModal'
import AddHolidays from './AddHolidays'
import { useUserStore } from '../../../store/user'
import { getFormattedDate, getUserRoles } from '../../../../utils/helper'
import { Axios } from '../../../../api/axios'
import { useHolidaysStore } from '../../../store/holidays'
import Loader from 'src/components/Loader'
import NoData from 'src/components/NoData'
import CustomButton from '../../layouts/components/shared-components/CustomButton'
import CustomBreadcrumb from '../../layouts/components/shared-components/CustomBreadcrumb'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import useWindowSize from '../../../hooks/useWindowSize'

const HolidaysInfo = ({ viewOnly }) => {
  const { user, pagination, setPagination } = useUserStore()
  const router = useRouter()
  const { pathname, query } = router
  const { page = 1, pageSize = 10 } = query
  const { setHolidays, holidays } = useHolidaysStore()
  const { isEmployee } = getUserRoles(user.role)
  const [isOpenModal, setIsOpenModal] = useState({ open: false, name: '' })
  const [anchorEl, setAnchorEl] = useState(null)
  const [userData, setUserData] = useState({ holidayName: '', holidayDate: '' })
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false)
  const [tableRows, setTableRows] = useState([])
  const [editLoading, setEditLoading] = useState()
  const [loading, setLoading] = useState()
  const [selectedRowValue, setSelectedRowValue] = useState({})
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [paginationLoading, setPaginationLoading] = useState(false)

  const { width } = useWindowSize()
  const pinnedColumns = width >= 768 ? { left: ['index', 'title'] } : {}

  const holidayPageSize = +(pagination.pageSize || 10)
  const holidayPage = pagination?.page ? pagination?.page - 1 : 0

  useEffect(() => {
    //setLoading(true)
    setPaginationLoading(true)
    Axios.get(`holidays?page=${page || 1}&pageSize=${pageSize || 10}`)
      .then(data => {
        setHolidays(data.data)
        setPagination(data.meta)
      })
      .finally(() => {
        setLoading(false)
        setPaginationLoading(false)
      })
  }, [page, pageSize])

  useEffect(() => {
    if (holidays.loading) return
    setTableRows(holidays)
  }, [holidays])

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
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

  const handleCloseModal = () => {
    setIsOpenModal({ open: !isOpenModal.open, name: 'edit' })
    setUserData({ holidayName: '', holidayDate: '' })
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await Axios.delete(`holidays/delete/${selectedRowValue.id}`)
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
    }
    const updatedData = tableRows?.filter(user => user.id !== selectedRowValue.id)
    setTableRows(updatedData)
    setHolidays(updatedData)
    setIsOpenRemoveModal(!isOpenRemoveModal)
    toast.success('Holiday deleted successfully')
    setDeleteLoading(false)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  const columns = [
    { field: 'index', headerName: '#', width: 90 },
    {
      field: 'title',
      headerName: 'Title',
      width: 350,
      editable: false
    },
    {
      field: 'date',
      headerName: 'Holiday Date',
      width: 250,
      editable: false,
      renderCell: params => <div>{dayjs(params.value).format('D MMM, YYYY')}</div>
    },
    {
      field: 'day',
      headerName: 'Day',
      width: 250,
      editable: false
    }
  ]

  if (!isEmployee && !viewOnly) {
    columns.push({
      field: 'action',
      headerName: 'Action',
      width: 100,
      renderCell: params => (
        <>
          <DotsVertical sx={{ cursor: 'pointer' }} onClick={handleDropdownOpen} />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => {
              setAnchorEl(null)
            }}
            sx={{
              '& .MuiMenu-paper': {
                width: 230,
                marginTop: 4,
                boxShadow: '0px 2px 10px 0px rgba(58, 53, 65, 0.1)'
              }
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              sx={{ p: 0 }}
              onClick={() => {
                setAnchorEl(null)
                setIsOpenModal({ open: !isOpenModal.open, name: 'edit' })
                setUserData({ ...selectedRowValue, date: getFormattedDate(selectedRowValue.date) })
              }}
            >
              <Box sx={styles}>
                <Pencil sx={{ marginRight: 2 }} />
                Edit
              </Box>
            </MenuItem>
            <MenuItem
              sx={{ p: 0 }}
              onClick={() => {
                setAnchorEl(null)
                setIsOpenRemoveModal(!isOpenRemoveModal)
              }}
            >
              <Box sx={styles}>
                <TrashCanOutline sx={{ marginRight: 2 }} />
                Delete
              </Box>
            </MenuItem>
          </Menu>
        </>
      )
    })
  }

  const tableRowsUpdated = tableRows.map((row, index) => ({ ...row, index: index + 1 + holidayPage * holidayPageSize }))

  const handleSave = async () => {
    const obj = {
      title: userData.title,
      date: getFormattedDate(userData.date),
      day: getFormattedDate(userData.date, 'dddd')
    }
    if (isOpenModal.name === 'add') {
      setEditLoading(true)
      try {
        const resp = await Axios.post('holidays/add', { ...obj })
        toast.success('Holiday added successfully')
        setTableRows([
          ...tableRows,
          {
            ...resp
          }
        ])
      } catch (e) {
        toast.error(e?.response?.data?.message || e.message)
      }
    } else {
      const updatedObject = {
        id: selectedRowValue.id,
        title: userData.title,
        date: userData.date,
        day: dayjs(userData.date).format('dddd')
      }

      const editedUser = tableRows.map(data => {
        if (data.id === selectedRowValue.id) {
          return updatedObject
        } else {
          return data
        }
      })

      setEditLoading(true)
      try {
        await Axios.patch('holidays/edit', updatedObject)
        toast.success('Holiday updated successfully')
      } catch (e) {
        toast.error(e?.response?.data?.message || e.message)
      }
      setTableRows(editedUser)
    }
    setEditLoading(false)
    setUserData({ holidayName: '', holidayDate: '' })
    handleCloseModal()
  }

  return (
    <div>
      <CustomBreadcrumb title='Holidays' BreadcrumbTitle='Holidays'>
        {!isEmployee && !viewOnly && (
          <CustomButton
            fullWidth={false}
            sx={{ minWidth: '200px' }}
            onClick={() => {
              setIsOpenModal({ open: !isOpenModal.open, name: 'add' })
            }}
          >
            Add Holiday
          </CustomButton>
        )}
      </CustomBreadcrumb>
      {userData ? (
        <Container>
          <div className='leave-wrapper mt-24'>
            {loading ? (
              <Loader />
            ) : (
              <CustomTable
                columns={columns}
                rows={tableRowsUpdated}
                onRowClick={params => {
                  setSelectedRowValue(params.row)
                }}
                onPaginationModelChange={handlePaginationModelChange}
                rowCount={pagination?.total}
                loading={paginationLoading}
                paginationMode='server'
                pinnedColumns={pinnedColumns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: +(pagination.pageSize || 10),
                      page: (pagination?.page || 1) - 1
                    }
                  }
                }}
              />
            )}
          </div>
        </Container>
      ) : (
        <NoData />
      )}
      {isOpenModal.open && (
        <AddHolidays
          handleCloseModal={handleCloseModal}
          isOpenModal={isOpenModal}
          userData={userData}
          setUserData={setUserData}
          handleSave={handleSave}
          loading={editLoading}
        />
      )}
      {isOpenRemoveModal && (
        <CustomRemoveModal
          open={isOpenRemoveModal}
          handleClose={() => {
            setAnchorEl(null)
            setIsOpenRemoveModal(!isOpenRemoveModal)
          }}
          title='Delete Holiday'
          description='Are you sure want to delete?'
          onConfirm={handleDelete}
          deleteLoading={deleteLoading}
        />
      )}
    </div>
  )
}

export default HolidaysInfo
