import React, { useEffect, useMemo, useState } from 'react'
import { Button, FormControl, IconButton, InputLabel } from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { departmentList } from '../../constant/User'
import EmployeesDetails from '../EmployeesDetails'
import { useUserStore } from '../../../store/user'
import { Axios } from '../../../../api/axios'
import Loader from 'src/components/Loader'
import CustomInput from '../../../components/CustomInput'
import CustomBreadcrumb from '../../layouts/components/shared-components/CustomBreadcrumb'
import Tabs from '../../../components/Tabs'
import EmployeeData from '../EmployeeData'
import ListView from '../../../asset/image/ListView.jsx'
import GridView from '../../../asset/image/GridView.jsx'
import { useRouter } from 'next/router'
import { useDebounce } from '../../../hooks/useDebounce'
import { TabViewType } from 'utils/helper'
import { Container } from '@mui/material'

const EmployeesList = ({ viewOnly }) => {
  const { allUser, setAllUser, pagination, setPagination } = useUserStore()

  const router = useRouter()
  const { query, pathname } = router
  const { tab, employeeName, department, page = 1, pageSize = 10, tabType } = query

  const searchName = employeeName ? decodeURIComponent(employeeName) : ''
  const searchDept = department ? decodeURIComponent(department) : ''
  const [filterEmployeeName, setFilterEmployeeName] = useState(searchName || '')
  const [filterDepartment, setFilterDepartment] = useState(searchDept || '')
  const [loading, setLoading] = useState()
  const [activeType, setActiveType] = useState(tabType || 'active')
  const [isGrid, setIsGrid] = useState(false)
  const [paginationLoading, setPaginationLoading] = useState(false)
  const employeeNameDebounce = useDebounce(filterEmployeeName, 1000)
  const [isChangeFilter, setIsChangeFilter] = useState(false)

  useEffect(() => {
    setIsGrid(tab === TabViewType.GRID)
  }, [tab])

  const handleView = isGrid => {
    if (isGrid) {
      setAllUser([])
    }
    setPagination({ ...pagination, page: 1 })
    router.push(
      {
        pathname,
        query: { ...query, tab: isGrid ? TabViewType.GRID : TabViewType.TABLE, page: 1 }
      },
      undefined,
      {
        shallow: true
      }
    )
  }

  useEffect(() => {
    setAllUser([])
  }, [])

  const fetch = async (page, pageSize) => {
    //setLoading(true)
    setPaginationLoading(true)
    let url = `user/all?employeeStatus=${activeType}`
    if (employeeName) {
      url += `&employeeName=${employeeName}`
    }
    if (department) {
      url += `&department=${department}`
    }
    url += `&page=${page || 1}&pageSize=${pageSize || 10}`

    try {
      const res = await Axios.get(url)
      if (isGrid) {
        if (res.meta.page === 1) {
          setAllUser([...res.data])
        } else {
          setAllUser([...allUser, ...res.data])
        }
      } else {
        setAllUser(res.data)
      }
      setPagination(res.meta)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setPaginationLoading(false)
    }
  }

  useEffect(() => {
    fetch(page, pageSize)
  }, [activeType, page, pageSize, isGrid, employeeName, department])

  const noOfPages = useMemo(() => {
    return Math.ceil(pagination.total / pagination.pageSize)
  }, [pagination.total, pagination.pageSize])

  const fetchData = () => {
    if (noOfPages !== pagination?.page) {
      fetch(+pagination.page + 1, pageSize)
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

  const handleChange = (event, newValue) => {
    router.push({ pathname, query: { ...query, tabType: newValue, page: 1 } }, undefined, {
      shallow: true
    })
    if (isGrid) {
      setAllUser([])
    }
    setActiveType(newValue)
  }

  const filterData = type => {
    return allUser.filter(d => d.employeeStatus === type)
  }

  useEffect(() => {
    const param = { ...query }
    if (filterEmployeeName) {
      param.employeeName = encodeURIComponent(filterEmployeeName)
    } else {
      delete param['employeeName']
    }
    if (filterDepartment) {
      param.department = encodeURIComponent(filterDepartment)
    } else {
      delete param['department']
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
  }, [employeeNameDebounce, filterDepartment, filterEmployeeName])

  const handleEmployeeName = e => {
    setAllUser([])
    if (!isChangeFilter) setIsChangeFilter(true)
    setFilterEmployeeName(e.target.value)
  }

  const handleSelectDepartment = e => {
    setAllUser([])
    if (!isChangeFilter) setIsChangeFilter(true)
    setFilterDepartment(e.target.value)
  }

  return (
    <div>
      <CustomBreadcrumb title='Employees' BreadcrumbTitle='Employees' />
      <Container>
        <div className='employee-list-wrap'>
          <div className='search-bar scrollbar-css'>
            <CustomInput label='Employee Name' value={filterEmployeeName} onChange={handleEmployeeName} />
            <FormControl sx={{ marginBottom: 1 }}>
              <InputLabel id='demo-simple-select-helper-label'>Select Department</InputLabel>
              <Select label='Select Department' value={filterDepartment} onChange={handleSelectDepartment}>
                <MenuItem value=''>All</MenuItem>
                {departmentList.map((d, i) => (
                  <MenuItem key={i} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <>
              {viewOnly ? (
                <div className='employee-data'>
                  <div className='pt-30'>
                    {isGrid ? (
                      <EmployeesDetails
                        viewOnly={viewOnly}
                        allUsers={filterData('active')}
                        fetchData={fetchData}
                        pagination={pagination}
                        noOfPages={noOfPages}
                      />
                    ) : (
                      <EmployeeData
                        viewOnly={viewOnly}
                        employeeData={filterData('active')}
                        pagination={pagination}
                        handlePaginationModelChange={handlePaginationModelChange}
                        paginationLoading={paginationLoading}
                        pageSize={pageSize}
                      />
                    )}
                  </div>
                  <div className='grid-list-icon'>
                    <div className='grid-list-button'>
                      <IconButton
                        size='small'
                        aria-label='settings'
                        className={`${isGrid ? '' : 'active'}`}
                        onClick={() => handleView(false)}
                      >
                        <ListView fill={!isGrid ? '#1883C2' : '#7D7D7D'} />
                      </IconButton>
                      <IconButton
                        size='small'
                        aria-label='settings'
                        className={`${isGrid ? 'active' : ''}`}
                        onClick={() => handleView(true)}
                      >
                        <GridView fill={isGrid ? '#1883C2' : '#7D7D7D'} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='employee-data employee-data-wrap'>
                  <div className='employee-data-tabs'>
                    <Tabs
                      value={activeType}
                      handleChange={handleChange}
                      className='employee-tabs'
                      tabList={[
                        {
                          value: 'active',
                          label: 'Active',
                          content: isGrid ? (
                            <EmployeesDetails
                              allUsers={filterData('active')}
                              fetchData={fetchData}
                              pagination={pagination}
                              noOfPages={noOfPages}
                            />
                          ) : (
                            <EmployeeData
                              employeeData={filterData('active')}
                              handlePaginationModelChange={handlePaginationModelChange}
                              pagination={pagination}
                              paginationLoading={paginationLoading}
                            />
                          )
                        },
                        {
                          value: 'pending',
                          label: 'Pending',
                          content: isGrid ? (
                            <EmployeesDetails
                              allUsers={filterData('pending')}
                              fetchData={fetchData}
                              pagination={pagination}
                              noOfPages={noOfPages}
                            />
                          ) : (
                            <EmployeeData
                              employeeData={filterData('pending')}
                              handlePaginationModelChange={handlePaginationModelChange}
                              pagination={pagination}
                              paginationLoading={paginationLoading}
                            />
                          )
                        },
                        {
                          value: 'deactivated',
                          label: 'Deactivated',
                          content: isGrid ? (
                            <EmployeesDetails
                              allUsers={filterData('deactivated')}
                              fetchData={fetchData}
                              pagination={pagination}
                              noOfPages={noOfPages}
                            />
                          ) : (
                            <EmployeeData
                              employeeData={filterData('deactivated')}
                              handlePaginationModelChange={handlePaginationModelChange}
                              pagination={pagination}
                              paginationLoading={paginationLoading}
                            />
                          )
                        }
                      ]}
                    />
                  </div>
                  <div className='grid-list-icon'>
                    <div className='grid-list-button'>
                      <IconButton
                        size='small'
                        aria-label='settings'
                        className={`${isGrid ? '' : 'active'}`}
                        onClick={() => handleView(false)}
                      >
                        <ListView fill={!isGrid ? '#1883C2' : '#7D7D7D'} />
                      </IconButton>
                      <IconButton
                        size='small'
                        aria-label='settings'
                        className={`${isGrid ? 'active' : ''}`}
                        onClick={() => handleView(true)}
                      >
                        <GridView fill={isGrid ? '#1883C2' : '#7D7D7D'} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  )
}

export default EmployeesList
