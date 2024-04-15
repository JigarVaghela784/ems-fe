import React, { useEffect, useMemo } from 'react'
import { Container, FormControl, IconButton } from '@mui/material'
import CustomInput from '../../../../components/CustomInput'
import CustomSelect from '../../../layouts/components/shared-components/CustomSelect'
import { getUniqueListBy } from '../../../../../utils/helper'
import ListView from '../../../../asset/image/ListView.jsx'
import GridView from '../../../../asset/image/GridView.jsx'

const ProjectFilter = ({
  filterEmployeeName,
  filterProjectName,
  setFilterEmployeeName,
  setFilterProjectName,
  handleView,
  projectList,
  searchProject,
  isGrid
}) => {
  const filterData = useMemo(() => {
    return projectList?.flatMap(item =>
      item?.employees?.map(items => {
        return {
          label: items?.employee?.name,
          value: items?.employee?.id
        }
      })
    )
  }, [projectList])

  const employeeList = getUniqueListBy(filterData, 'value')

  const handleEmployeeChange = selectedEmployees => {
    if (selectedEmployees.length > 0) {
      setFilterEmployeeName(selectedEmployees)
    } else {
      setFilterEmployeeName('')
    }
  }

  return (
    <>
      <div className={`search-attendance-employees scrollbar-css ${searchProject ? 'search-project' : ''}`}>
        <FormControl>
          <CustomInput
            label='Project Name'
            placeholder={'Enter Project Name'}
            value={filterProjectName}
            onChange={e => setFilterProjectName(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <CustomSelect
            multiple
            title='Emp. name'
            options={employeeList}
            value={filterEmployeeName}
            onChange={handleEmployeeChange}
          />
        </FormControl>
      </div>

      <div className='employee-data project-grid'>
        <div className={`grid-list-icons ${searchProject ? 'grid-list' : ''}`}>
          <div className='grid-list-button'>
            <IconButton
              size='small'
              aria-label='settings'
              className={`${isGrid ? '' : 'active'}`}
              onClick={() => handleView(false)}
            >
              <ListView fill={!isGrid ? '#1883c2' : '#7D7D7D'} />
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
    </>
  )
}

export default ProjectFilter
