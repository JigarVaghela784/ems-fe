// ** React Imports
import React, { Fragment, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import Image from 'next/image'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import FormHelperText from '@mui/material/FormHelperText'
import { setCookiesOptions } from 'utils/helper'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { baseUrl, loginUrl } from 'utils/consts'
import { Axios } from '../../../api/axios'
import { getCookie, setCookie } from 'cookies-next'
import CustomButton from '../../@core/layouts/components/shared-components/CustomButton'
import CustomInput from '../../components/CustomInput'
import AvatarUploadModal from 'src/components/AvatarUploadModal'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const RegisterPage = ({ data = {} }) => {
  // ** States
  const [values, setValues] = useState({
    profile: '',
    password: '',
    checkbox: false,
    showPassword: false
  })
  const [isVisible, setIsVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const [loader, showLoader] = useState(false)
  const [imageObj, setImageObj] = useState(null)
  const router = useRouter()

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      delete newErrors[prop]

      return newErrors
    })
  }

  const handleCheckbox = value => {
    setValues({ ...values, checkbox: value })
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      delete newErrors['checkbox']

      return newErrors
    })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const handleSubmit = async () => {
    const { showPassword, checkbox, ...res } = values
    if (validateForm()) {
      const { name, email, password, profile } = values
      const newUser = { name, email, password, profile }
      showLoader(true)
      if (imageObj) {
        const formData = new FormData()
        formData.append('file', imageObj)

        try {
          const url = await Axios.post(`/upload/media`, formData)
          newUser.profile = url
          setValues({ ...values, profile: url })
        } catch (e) {
          toast.error(e?.response?.data?.message || e.message)
          showLoader(false)
        }
        setImageObj(null)
      }
      Axios.post('register', newUser)
        .then(response => {
          // Handle the response data here
          const options = setCookiesOptions()
          setCookie('token', response.access_token, options)

          toast.success('Register success')
          router.push(loginUrl)
        })
        .catch(error => {
          // Handle errors here
          if (error) {
            const errorMsg = error?.response?.data?.message || error?.message
            toast.error(errorMsg)
            showLoader(false)
          }
        })
    }
  }

  const handleFileSave = async (url, image) => {
    setImageObj(image)
    setIsVisible(false)
    setValues({ ...values, profile: url ? url : null })
  }

  const handleReset = () => {
    setValues({ ...values, profile: null })
  }

  const validateForm = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    const passwordMinLength = 6

    const errors = {}

    // if (!values.profile) {
    //   errors.profile = 'Profile is required'
    // }
    if (!values.name?.trim()) {
      errors.name = 'Username is required'
    }

    if (!values.email?.trim() || !emailPattern.test(values.email)) {
      errors.email = 'Email is required'
    }

    if (values.password?.length < passwordMinLength) {
      errors.password = `Password is required`
    }

    if (!values.checkbox) {
      errors.checkbox = true
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors)

      return false
    }
    setErrors({})

    return true
  }

  return (
    <Fragment>
      <Box className='content-center'>
        <Card sx={{ zIndex: 1 }}>
          <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>

            <Box sx={{ mb: 6 }}>
              <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5, textAlign: 'center' }}>
                Adventure starts here 🚀
              </Typography>
              <Typography variant='body2' sx={{ textAlign: 'center', marginBottom: 1 }}>
                Make your app management easy and fun!
              </Typography>
            </Box>

            <form autoComplete='off' onSubmit={e => e.preventDefault()}>
              <AvatarUploadModal
                setIsVisible={setIsVisible}
                isVisible={isVisible}
                aspect={1}
                isImageCrop
                handleSave={(url, image) => handleFileSave(url, image)}
              />
              <Grid container style={{ width: '100%', margin: '-20px 0 20px' }} spacing={7}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ImgStyled src={values?.profile ? values?.profile : '/images/avatars/1.png'} alt='Profile Pic' />
                    <Box>
                      <div className='mb-10'>
                        <ButtonStyled component='label' variant='contained' onClick={() => setIsVisible(true)}>
                          Upload New Photo
                        </ButtonStyled>
                      </div>
                      <ResetButtonStyled color='error' variant='outlined' onClick={handleReset}>
                        Reset
                      </ResetButtonStyled>
                    </Box>
                  </Box>
                  <FormHelperText className='MuiFormHelperText-root' error={!!errors.profile}>
                    {errors.profile && !values.profile ? errors.profile : ''}
                  </FormHelperText>
                </Grid>
              </Grid>
              <CustomInput
                onChange={handleChange('name')}
                autoFocus
                fullWidth
                id='username'
                label='Full name'
                error={!!errors.name}
                helperText={errors.name}
                sx={{ marginBottom: 4 }}
              />
              <CustomInput
                onChange={handleChange('email')}
                fullWidth
                type='œ'
                label='Email'
                sx={{ marginBottom: 4 }}
                error={!!errors.email}
                helperText={errors.email}
              />
              <FormControl fullWidth error={!!errors.password}>
                <InputLabel htmlFor='auth-register-password'>Password</InputLabel>
                <OutlinedInput
                  label='Password'
                  value={values.password}
                  id='auth-register-password'
                  onChange={handleChange('password')}
                  type={values.showPassword ? 'text' : 'password'}
                  error={!!errors.password}
                  margin='dense'
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {values.showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText className='MuiFormHelperText-root'>
                  {errors.password ? errors.password : ''}
                </FormHelperText>
              </FormControl>
              <FormControl error={!!errors.checkbox}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.checkbox}
                      onChange={e => handleCheckbox(!values.checkbox)}
                      color='primary'
                    />
                  }
                  label={
                    <Fragment>
                      <span>I agree to </span>
                      <Link href={baseUrl} passHref>
                        <LinkStyled onClick={e => e.preventDefault()}>privacy policy & terms</LinkStyled>
                      </Link>
                    </Fragment>
                  }
                />
                <FormHelperText sx={{ marginTop: '-20px', marginBottom: '1rem' }} className='MuiFormHelperText-root'>
                  {errors.checkbox ? 'Please agree to the terms' : ''}
                </FormHelperText>
              </FormControl>

              <CustomButton
                loading={loader}
                variant='contained'
                sx={{ marginRight: 3.5, marginBottom: '1em' }}
                onClick={handleSubmit}
                loadingProps={{ size: 25 }}
              >
                Sign up
              </CustomButton>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography variant='body2' sx={{ marginRight: 2 }}>
                  Already have an account?
                </Typography>
                <Typography variant='body2'>
                  <Link passHref href='/login'>
                    <LinkStyled>Sign in instead</LinkStyled>
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
        <FooterIllustrationsV1 />
      </Box>
    </Fragment>
  )
}
RegisterPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export async function getServerSideProps(props) {
  const id = getCookie('token', props)
  if (id) {
    return {
      redirect: {
        destination: baseUrl
      }
    }
  }

  return { props: {} }
}

export default RegisterPage
