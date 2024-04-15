import React, { useState } from 'react'
import CustomModal from '../CustomModal'
import {
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Grid,
  OutlinedInput,
  Select,
  Button,
  Avatar,
  Tooltip,
  Chip,
  Box
} from '@mui/material'
import { CloseCircle } from 'mdi-material-ui'
import { departmentList, designationList, roleList, userStatus } from '../../constant/User'
import CustomRemoveModal from '../../layouts/components/shared-components/CustomRemoveModal'
import CustomDatePicker from '../../layouts/components/shared-components/CustomDatePicker'
import { Axios } from '../../../../api/axios'
import { toast } from 'react-toastify'
import { capitalizeFLetter, WORKING_DAYS } from '../../../../utils/helper'
import CustomInput from '../../../components/CustomInput'
import dayjs from 'dayjs'

const EditEmployeeDetails = ({ open, deleteLoading, handleDelete, userData, setShowEditModal, handleSave, avatar }) => {
  const [values, setValues] = useState({ ...userData })
  const [showRemoveModal, setRemoveModal] = useState(false)

  const {
    joiningDate = new Date(),
    name = '',
    email = '',
    phone = '',
    age = '',
    password = '',
    id = '',
    department = '',
    designation = '',
    employeeStatus = '',
    workingHours = 5,
    role = '',
    workingDays,
    state
  } = values || {}

  const [showPassword, setShowPassword] = useState(false)
  const newDate = joiningDate ? new Date(joiningDate) : null
  const [updateLoading, setUpdateLoading] = useState(false)

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleDateChange = prop => date => {
    setValues({ ...values, [prop]: date })
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const handleImageChange = prop => file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setValues({ ...values, [prop]: reader.result })
      reader.readAsDataURL(files[0])
    }
  }

  const handleUpdate = async () => {
    setUpdateLoading(true)
    const { ...payload } = values

    try {
      await Axios.patch('user/edit', payload)
      toast.success('User updated successfully')
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
      setUpdateLoading(false)

      return
    }
    handleSave(values)
    setUpdateLoading(false)
    setShowEditModal(false)
  }

  return (
    <div>
      <CustomModal
        open={open}
        handleClose={() => setShowEditModal(null)}
        handleDelete={() => setRemoveModal(true)}
        handleSave={handleUpdate}
        title={'Edit Profile Details'}
        loading={updateLoading}
        loadingProps={{ size: 25 }}
        onOkText={'Update'}
        onCancelText={'Delete'}
      >
        <div className='edit-profile-wrapper'>
          <div>
            {(avatar || values.avatar) && (
              <Tooltip title='Remove Avatar' placement='top'>
                <div
                  className='removeIcon'

                  // onClick={() => {
                  //   setValues({ ...values, avatar: '' })
                  // }}
                >
                  <CloseCircle />
                </div>
              </Tooltip>
            )}

            <Avatar className='edit-profile-image' alt='Flora' src={avatar || values.avatar} />
          </div>
          <Button component='label' variant='contained' htmlFor='account-settings-upload-image'>
            Upload New Photo
            <input
              hidden
              type='file'
              onChange={handleImageChange('avatar')}
              accept='image/png, image/jpeg'
              id='account-settings-upload-image'
            />
          </Button>
        </div>
        <CardContent>
          <form>
            <Grid container spacing={7}>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  fullWidth
                  label='Name'
                  onChange={handleChange('name')}
                  placeholder='johnDoe'
                  value={name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  fullWidth
                  label='Phone'
                  onChange={handleChange('phone')}
                  type='number'
                  placeholder='+91 12345-67890'
                  value={phone}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  disabled
                  fullWidth
                  onChange={handleChange('email')}
                  type='email'
                  label='Email'
                  placeholder='johnDoe@example.com'
                  value={email}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomInput
                  fullWidth
                  label='Age'
                  onChange={handleChange('age')}
                  type='number'
                  placeholder='20'
                  value={age}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomDatePicker
                  disabled
                  value={newDate ? dayjs(newDate) : null}
                  label='Date of Joining'
                  placeholderText='DD-MM-YYYY'
                  onChange={handleDateChange('doj')}
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
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-helper-label'>Select Designation</InputLabel>
                  <Select label='Select Designation' value={designation} onChange={handleChange('designation')}>
                    {designationList.map((d, i) => (
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
                  label='Working Hours'
                  onChange={handleChange('workingHours')}
                  type='number'
                  placeholder='5'
                  value={workingHours}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='demo-simple-select-helper-label'>Select Roles</InputLabel>
                  <Select label='Select Roles' value={role} onChange={handleChange('role')}>
                    {roleList.map((d, i) => (
                      <MenuItem key={i} value={d.value}>
                        {d.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
            </Grid>
          </form>
        </CardContent>
      </CustomModal>
      {showRemoveModal && (
        <CustomRemoveModal
          open={showRemoveModal}
          onConfirm={() => handleDelete(id)}
          handleClose={() => setRemoveModal(false)}
          title='Delete user'
          description='Are you sure want to delete?'
          deleteLoading={deleteLoading}
        />
      )}
    </div>
  )
}

export default EditEmployeeDetails
