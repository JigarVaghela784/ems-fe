import React, { useEffect, useMemo, useState } from 'react'
import CustomSelect from '../../layouts/components/shared-components/CustomSelect'
import CustomDatePicker from '../../layouts/components/shared-components/CustomDatePicker'
import CustomButton from '../../layouts/components/shared-components/CustomButton'
import { getUniqueListBy } from 'utils/helper'
import dayjs from 'dayjs'
import { customHandleChange } from '../Leaves/helper'

const DailySearch = ({ updatedData, update, setFilteredUpdateData }) => {
  const [filterEmployeeName, setFilterEmployeeName] = useState([])

  const [searchData, setSearchData] = useState({
    from: null,
    to: null
  })

  const handleSearch = () => {
    const filteredData = {}

    Object.keys(update).forEach(date => {
      const employeeNameMatch = update[date].filter(
        value =>
          (filterEmployeeName.length === 0 || filterEmployeeName.includes(value.employee.id)) &&
          (!searchData.from ||
            !searchData.to ||
            dayjs(value.createdAt).isBetween(dayjs(searchData.from), dayjs(searchData.to)))
      )

      if (employeeNameMatch.length > 0) {
        filteredData[date] = employeeNameMatch
      }
    })

    setFilteredUpdateData(filteredData)
  }

  useEffect(() => {
    setFilteredUpdateData(update)
  }, [update])

  const filteredEmployeeName = useMemo(() => {
    return updatedData.map(value => {
      return {
        label: value.employee.name,
        value: value.employee.id
      }
    })
  }, [updatedData])

  const employeeList = getUniqueListBy(filteredEmployeeName, 'value')

  return (
    <div className='daily-update-search'>
      <CustomSelect
        multiple
        title='Employee Name'
        options={employeeList}
        value={filterEmployeeName}
        onChange={value => setFilterEmployeeName(value)}
      />
      <CustomDatePicker
        label='From'
        value={searchData.from}
        onChange={newValue => setSearchData(customHandleChange(searchData, 'from', newValue))}
        slotProps={{ field: { clearable: true } }}
      />
      <CustomDatePicker
        label='To'
        value={searchData.to}
        onChange={newValue => setSearchData(customHandleChange(searchData, 'to', newValue))}
        slotProps={{ field: { clearable: true } }}
      />
      <CustomButton size='large' variant='contained' onClick={handleSearch} className='btnUpdateSearch'>
        Search
      </CustomButton>
    </div>
  )
}

export default DailySearch
