import { useState } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { FormHelperText } from '@mui/material'
import CustomButton from '../../@core/layouts/components/shared-components/CustomButton'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { Axios } from '../../../api/axios'
import { toast } from 'react-toastify'
import { setCookiesOptions } from '../../../utils/helper'

const TabSecurity = ({ data }) => {
  const [values, setValues] = useState({
    newPassword: '',
    currentPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showCurrentPassword: false,
    showConfirmNewPassword: false
  })

  const router = useRouter()

  const [errors, setErrors] = useState({})
  const [updateLoading, setUpdateLoading] = useState(false)

  // Handle Current Password
  const handleCurrentPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      delete newErrors[prop]

      return newErrors
    })
  }

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }

  const handleMouseDownCurrentPassword = event => {
    event.preventDefault()
  }

  const handleNewPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      delete newErrors['confirmNewPassword']
      delete newErrors['newPassword']

      return newErrors
    })
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleMouseDownNewPassword = event => {
    event.preventDefault()
  }

  const handleConfirmNewPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      delete newErrors[prop]

      return newErrors
    })
  }

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const handleMouseDownConfirmNewPassword = event => {
    event.preventDefault()
  }

  const handleSaveChanges = async () => {
    if (validateForm()) {
      const payload = {
        ...data,
        currentPassword: values.currentPassword,
        password: values.confirmNewPassword
      }
      delete payload.createdTime
      setUpdateLoading(true)
      Axios.patch('user/edit', payload)
        .then(response => {
          // Handle the response data here
          toast.success('Password changed successfully')
          const options = setCookiesOptions()
          deleteCookie('token', options)
          router.push({
            pathname: '/pages/login',
            query: { email: encodeURIComponent(data.email) }
          })
          setUpdateLoading(false)
        })
        .catch(error => {
          // Handle errors here
          if (error) {
            const errorMsg = error?.response?.data?.message || error?.message
            toast.error(errorMsg)
            setUpdateLoading(false)
          }
        })
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    handleSaveChanges()
  }

  const validateForm = () => {
    const errors = {}
    if (!values.currentPassword) {
      errors.currentPassword = 'Please enter current password!'
    }
    if (!values.newPassword) {
      errors.newPassword = 'New Password is required!'
    }
    if (values.newPassword !== values.confirmNewPassword) {
      errors.confirmNewPassword = 'Password do not match!'
    }
    if (!values.confirmNewPassword) {
      errors.confirmNewPassword = 'Confirm Password is required!'
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors)

      return false
    }
    setErrors({})

    return true
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent sx={{ paddingBottom: 0 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={5}>
              <Grid item xs={12} sx={{ marginTop: 4.75 }}>
                <FormControl error={!!errors.currentPassword} fullWidth>
                  <InputLabel htmlFor='account-settings-current-password'>Current Password</InputLabel>
                  <OutlinedInput
                    label='Current Password'
                    value={values.currentPassword}
                    id='account-settings-current-password'
                    type={values.showCurrentPassword ? 'text' : 'password'}
                    onChange={handleCurrentPasswordChange('currentPassword')}
                    error={!!errors.currentPassword}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          aria-label='toggle password visibility'
                          onClick={handleClickShowCurrentPassword}
                          onMouseDown={handleMouseDownCurrentPassword}
                        >
                          {values.showCurrentPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText className='MuiFormHelperText-root'>
                    {errors.currentPassword ? errors.currentPassword : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.newPassword}>
                  <InputLabel htmlFor='account-settings-new-password'>New Password</InputLabel>
                  <OutlinedInput
                    label='New Password'
                    value={values.newPassword}
                    id='account-settings-new-password'
                    onChange={handleNewPasswordChange('newPassword')}
                    type={values.showNewPassword ? 'text' : 'password'}
                    error={!!errors.newPassword}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowNewPassword}
                          aria-label='toggle password visibility'
                          onMouseDown={handleMouseDownNewPassword}
                        >
                          {values.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText className='MuiFormHelperText-root'>
                    {errors.newPassword ? errors.newPassword : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.confirmNewPassword || !!errors.newPassword}>
                  <InputLabel htmlFor='account-settings-confirm-new-password'>Confirm New Password</InputLabel>
                  <OutlinedInput
                    label='Confirm New Password'
                    value={values.confirmNewPassword}
                    id='account-settings-confirm-new-password'
                    type={values.showConfirmNewPassword ? 'text' : 'password'}
                    onChange={handleConfirmNewPasswordChange('confirmNewPassword')}
                    error={!!errors.confirmNewPassword || !!errors.newPassword}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          aria-label='toggle password visibility'
                          onClick={handleClickShowConfirmNewPassword}
                          onMouseDown={handleMouseDownConfirmNewPassword}
                        >
                          {values.showConfirmNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText className='MuiFormHelperText-root'>
                    {errors.confirmNewPassword ? errors.confirmNewPassword : ''}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            sm={6}
            xs={12}
            sx={{ display: 'flex', marginTop: [7.5, 2.5], alignItems: 'center', justifyContent: 'center' }}
          >
            <img width={183} alt='avatar' height={256} src='/images/pages/pose-m-1.png' />
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ margin: 0 }} />

      <CardContent>
        <Box sx={{ mt: 0, ml: 5 }}>
          <CustomButton
            loadingProps={{
              size: 26
            }}
            style={{
              width: 172
            }}
            loading={updateLoading}
            onClick={handleSaveChanges}
            fullWidth={false}
            sx={{ marginRight: 3.5 }}
            type='submit'
          >
            Save Changes
          </CustomButton>
        </Box>
      </CardContent>
    </form>
  )
}

export default TabSecurity
