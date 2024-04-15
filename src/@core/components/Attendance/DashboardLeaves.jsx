import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import CustomSelect from '../../layouts/components/shared-components/CustomSelect'
import { getFormattedDate, statusList, LeaveStatus } from '../../../../utils/helper'
import { useTeamLeaves } from '../../../store/teamleaves'
import { Axios } from '../../../../api/axios'
import CustomTable from '../../layouts/components/shared-components/CustomTable'
import EmployeesDetails from '../EmployeesDetails'
import Tabs from '../../../components/Tabs'
import isBetween from 'dayjs/plugin/isBetween'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import useWindowSize from '../../../hooks/useWindowSize'

dayjs.extend(isBetween)

const DashboardLeaves = ({ upcomingData }) => {
  const router = useRouter()
  const { teamLeaves } = useTeamLeaves()
  const [tableRows, setTableRows] = useState([])
  const [activeType, setActiveType] = useState('active')

  const { width } = useWindowSize()
  const pinnedColumns = width >= 768 ? { left: ['name'] } : {}

  const handleChange = (event, newValue) => {
    setActiveType(newValue)
  }

  const handleSelect = (params, value) => {
    const updateValue = tableRows.map(d => (d.id === params.id ? { ...d, status: value } : { ...d }))
    setTableRows(updateValue)
    const { row = {} } = params
    const { status, ...payload } = row || {}
    Axios.patch('leave/update', { ...payload, status: value }).then(() => {
      toast.success('Leave updated successfully')
    })
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 160,
      editable: false,
      renderCell: params => {
        return (
          <div
            className='cursor-pointer text-link'
            onClick={() => {
              router.push({
                pathname: '/employee-profile',
                query: { userId: params.row.user.id }
              })
            }}
          >
            {params.row.user.name}
          </div>
        )
      }
    },
    {
      field: 'from',
      headerName: 'From',
      width: 160,
      editable: false,
      renderCell: params => <div>{dayjs(params.value).format('D MMM, YYYY')}</div>
    },
    {
      field: 'noOfDay',
      headerName: 'No. of Days',
      width: 160,
      editable: false
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      editable: false,
      renderCell: params => {
        if (params.row.isEditable) {
          return (
            <div className='teamleavesStatus'>
              <CustomSelect
                style={{ fontSize: '0.875rem' }}
                id='status'
                options={statusList}
                className='LeaveApprovalStatus'
                value={params.row.status}
                handleChange={({ target: { value } }) => handleSelect(params, value)}
              />
            </div>
          )
        } else {
          const statusVal = statusList.find(s => s.value === (params.formattedValue || 'pending'))

          return (
            <div className='d-flex align-center'>
              {statusVal?.icons}
              <span className='pl-2'>{statusVal?.name}</span>
            </div>
          )
        }
      }
    }
  ]

  useEffect(() => {
    setTableRows(teamLeaves)
  }, [teamLeaves])

  const updatedTableRows = useMemo(() => {
    return tableRows || []
  }, [tableRows])

  const filterData = type => {
    return updatedTableRows.filter(d => d.status === type).sort((a, b) => new Date(a.from) - new Date(b.from))
  }

  const currentDate = getFormattedDate()

  const isCurrentDateAtLimits = useMemo(
    () => (from, to) => {
      return currentDate === getFormattedDate(from) || currentDate === getFormattedDate(to)
    },
    [currentDate]
  )

  const todayLeavesApproved = useMemo(() => {
    return updatedTableRows.filter(
      ({ from, to, status }) =>
        status === LeaveStatus.APPROVE &&
        (dayjs(currentDate).isBetween(getFormattedDate(from), getFormattedDate(to)) || isCurrentDateAtLimits(from, to))
    )
  }, [updatedTableRows])

  return (
    <div className={`holiday-leaves-width ${!upcomingData ? 'w-full' : ''}`}>
      <div className='block-wrapper block-leaves'>
        <div className='title'>Leaves</div>
        <div>
          <Tabs
            value={activeType}
            handleChange={handleChange}
            className='todays-leaves'
            tabList={[
              {
                value: 'active',
                label: 'Approved',
                content: (
                  <div className='mt-20'>
                    <CustomTable columns={columns} rows={filterData('active')} pinnedColumns={pinnedColumns} />
                  </div>
                )
              },
              {
                value: 'pending',
                label: 'Pending',
                content: (
                  <div className='mt-20'>
                    <CustomTable columns={columns} rows={filterData('pending')} pinnedColumns={pinnedColumns} />
                  </div>
                )
              },
              {
                value: 'deactivated',
                label: 'Declined',
                content: (
                  <div className='mt-20'>
                    <CustomTable columns={columns} rows={filterData('inactive')} pinnedColumns={pinnedColumns} />
                  </div>
                )
              },
              {
                value: 'todays',
                label: "Today's",
                content: (
                  <div className='mt-20'>
                    <CustomTable columns={columns} rows={todayLeavesApproved} pinnedColumns={pinnedColumns} />
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardLeaves
