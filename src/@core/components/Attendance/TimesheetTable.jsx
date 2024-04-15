import React, { useState } from 'react'
import CustomTable from '../../layouts/components/shared-components/CustomTable'
import dayjs from 'dayjs'
import { ACTIVITY } from '../../../../utils/helper'
import useWindowSize from '../../../hooks/useWindowSize'

const TimesheetTable = ({ tableRows }) => {
  const [selectedRowValue, setSelectedRowValue] = useState({})
  const { width } = useWindowSize()
  const pinnedColumns = width >= 768 ? { left: ['index', 'date'] } : {}

  const columns = [
    { field: 'index', headerName: '#', width: 100 },
    {
      field: 'date',
      headerName: 'Date',
      width: 200,
      editable: false,
      renderCell: params => <div>{dayjs(params.value).format('ddd D MMM, YYYY')}</div>
    },
    {
      field: 'punchIn',
      headerName: ACTIVITY.PUNCH_IN,
      width: 180,
      editable: false
    },
    {
      field: 'punchOut',
      headerName: ACTIVITY.PUNCH_OUT,
      width: 180,
      editable: false
    },
    {
      field: 'workingTime',
      headerName: 'Production',
      width: 200,
      editable: false
    },
    {
      field: 'production',
      headerName: 'Working',
      width: 200,
      editable: false
    },

    {
      field: 'break',
      headerName: 'Break',
      width: 200,
      editable: false
    },
    {
      field: 'overTime',
      headerName: 'Overtime',
      width: 200,
      editable: false
    }
  ]

  const tableRowsUpdated = tableRows?.map((row, index) => ({ ...row, index: index + 1 }))

  return (
    <div className='pt-10'>
      <CustomTable
        columns={columns}
        rows={tableRowsUpdated}
        onRowClick={params => {
          setSelectedRowValue(params.row)
        }}
        pinnedColumns={pinnedColumns}
      />
    </div>
  )
}

export default TimesheetTable
