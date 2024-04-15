import React from 'react'
import {
  Box,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography
} from '@mui/material'
import { departmentList, genderList, roleList, userStatus } from '../../constant/User'
import dayjs from 'dayjs'
import { capitalizeFLetter, getFormattedDate, getUserRoles, userRole, WORKING_DAYS } from '../../../../utils/helper'
import CustomInput from '../../../components/CustomInput'
import CustomDatePicker from '../../layouts/components/shared-components/CustomDatePicker'
import { useUserStore } from '../../../store/user'

const ProfileDetails = ({ handleChange, values, isAdmin, handleEnterKeyPress, errors }) => {
  const {
    name = '',
    gender = '',
    phone = '',
    state = '',
    address = '',
    country = '',
    joiningDate = '',
    dob = null,
    department = '',
    designation = '',
    avatar = '',
    employeeStatus,
    workingHours = 5,
    workingDays,
    contractStart,
    contractEnd,
    role
  } = values || {}
  const { ADMIN, HR } = userRole
  const { user } = useUserStore()
  const { isEmployee: isEmpRole, isHR, isProjectOwner, isProjectManager, isTeamLeader } = getUserRoles(user.role)

  const isEmployee = isEmpRole || isProjectOwner || isProjectManager || isTeamLeader

  // const newDate = dob ? new Date(dob) : dob

  //const contractStartVal = contractStart ? new Date(contractStart) : null
  //const workingDaysVal = workingDays ? new Date(contractEnd) : null
  const joiningDateVal = joiningDate ? new Date(joiningDate) : null

  // const handleDateChange = prop => date => {
  //   handleChange(prop)({ target: { value: date ? dayjs(date).format('D MMM YYYY') : date } })
  // }

  return (
    <CardContent className='profile-details-wrapper'>
      <form onSubmit={e => e.preventDefault()}>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6}>
            <CustomInput
              fullWidth
              label='Name'
              onChange={handleChange('name')}
              placeholder='Name'
              value={name}
              onKeyDown={handleEnterKeyPress}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select label='Gender' value={gender} onChange={handleChange('gender')}>
                {genderList.map((d, i) => (
                  <MenuItem key={i} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomDatePicker
              sx={{ marginBottom: 3 }}
              label='Date of Birth'
              value={dob ? dayjs(dob) : null}
              onChange={value => handleChange('dob')({ target: { value: getFormattedDate(value) } })}
              onKeyDown={handleEnterKeyPress}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomInput
              fullWidth
              label='Phone'
              name='phone'
              onChange={handleChange('phone')}
              type='number'
              placeholder='+91 12345-67890'
              value={phone}
              error={errors?.phone}
              onWheel={() => document.activeElement.blur()}
              onKeyDown={handleEnterKeyPress}
            />
            {errors?.phone ? (
              <Typography variant='body2' color='error'>
                {errors?.phone}
              </Typography>
            ) : (
              ''
            )}
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomInput
              fullWidth
              label='Address'
              onChange={handleChange('address')}
              placeholder='Address'
              value={address}
              onKeyDown={handleEnterKeyPress}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomInput
              fullWidth
              label='State'
              onChange={handleChange('state')}
              placeholder='State'
              value={state}
              onKeyDown={handleEnterKeyPress}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomInput
              fullWidth
              label='Country'
              onChange={handleChange('country')}
              placeholder='Country'
              value={country}
              onKeyDown={handleEnterKeyPress}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Select Department</InputLabel>
              <Select label='Select Department' value={department} onChange={handleChange('department')}>
                {departmentList.map((d, i) => (
                  <MenuItem key={i} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomInput
              fullWidth
              label='Designation'
              onChange={handleChange('designation')}
              placeholder='Designation'
              value={designation}
              onKeyDown={handleEnterKeyPress}
            />
          </Grid>
          {isAdmin && (
            <>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  fullWidth
                  label='Daily Working Hours'
                  onChange={handleChange('workingHours')}
                  type='number'
                  placeholder='5'
                  value={workingHours}
                  onKeyDown={handleEnterKeyPress}
                />
                <div style={{ paddingTop: 25 }}>
                  <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-helper-label'>Employee Status</InputLabel>
                    <Select label='Employee Status' value={employeeStatus} onChange={handleChange('employeeStatus')}>
                      {userStatus.map((d, i) => (
                        <MenuItem key={i} value={d.value}>
                          {capitalizeFLetter(d.label)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='demo-multiple-chip-label'>Working Days</InputLabel>
                  <Select
                    labelId='Working Days'
                    id='workingDays'
                    multiple
                    value={workingDays}
                    onChange={handleChange('workingDays')}
                    input={<OutlinedInput id='working Days' label='Working Days' />}
                    renderValue={selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map(value => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {WORKING_DAYS?.map(days => {
                      return (
                        <MenuItem key={days} value={days}>
                          {days}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
          {/*<Grid item xs={12} sm={6}>*/}
          {/*  <DatePickerWrapper>*/}
          {/*    <DatePicker*/}
          {/*      selected={contractStartVal}*/}
          {/*      showYearDropdown*/}
          {/*      showMonthDropdown*/}
          {/*      id='contractStart'*/}
          {/*      placeholderText='DD-MM-YYYY'*/}
          {/*      disabled={isEmployee}*/}
          {/*      customInput={<CustomInput label='Contract start date' disabled={isEmployee} />}*/}
          {/*      onChange={!isEmployee ? handleDateChange('contractStart') : () => {}}*/}
          {/*      onKeyDown={handleEnterKeyPress}*/}
          {/*    />*/}
          {/*  </DatePickerWrapper>*/}
          {/*</Grid>*/}
          {/*<Grid item xs={12} sm={6}>*/}
          {/*  <DatePickerWrapper>*/}
          {/*    <DatePicker*/}
          {/*      selected={workingDaysVal}*/}
          {/*      showYearDropdown*/}
          {/*      showMonthDropdown*/}
          {/*      disabled={isEmployee}*/}
          {/*      id='contractEnd'*/}
          {/*      placeholderText='DD-MM-YYYY'*/}
          {/*      customInput={<CustomInput label='Contract end date' disabled={isEmployee} />}*/}
          {/*      onChange={!isEmployee ? handleDateChange('contractEnd') : () => {}}*/}
          {/*      onKeyDown={handleEnterKeyPress}*/}
          {/*    />*/}
          {/*  </DatePickerWrapper>*/}
          {/*</Grid>*/}
          <Grid item xs={12} sm={6}>
            <CustomDatePicker
              sx={{ marginBottom: 3 }}
              label='Joining Date'
              value={joiningDateVal ? dayjs(joiningDateVal) : null}
              onChange={value => handleChange('joiningDate')({ target: { value: getFormattedDate(value) } })}
              id='joiningDate'
              disabled={isEmployee}
              onKeyDown={handleEnterKeyPress}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-helper-label'>Select Roles</InputLabel>
              <Select
                label='Select Roles'
                value={role}
                onChange={!isEmployee ? handleChange('role') : () => {}}
                disabled={isEmployee}
              >
                {roleList.map((d, i) => (
                  <MenuItem key={i} value={d.value} disabled={isHR ? [HR, ADMIN].includes(d.value) : false}>
                    {d.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default ProfileDetails
