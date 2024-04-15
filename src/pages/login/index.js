import { useEffect, useState } from 'react'
import { setCookiesOptions } from 'utils/helper'
import { baseUrl, loginUrl } from 'utils/consts'
import { getCookie, setCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
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
import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { toast } from 'react-toastify'
import { Axios } from '../../../api/axios'
import CustomButton from '../../@core/layouts/components/shared-components/CustomButton'
import { FormHelperText } from '@mui/material'
import CustomInput from '../../components/CustomInput'
import dayjs from 'dayjs'

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LoginPage = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false
  })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [loader, showLoader] = useState(false)

  const [checked, setChecked] = useState(false)

  const handleChecked = () => {
    setChecked(!checked)
  }

  const router = useRouter()

  useEffect(() => {
    if (router.query.email) {
      setValues(prev => ({ ...prev, email: decodeURIComponent(router.query.email) }))
    }
  }, [router])

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
    setErrors({ ...errors, [prop]: '' })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const handleLogin = () => {
    const { email, password } = values
    const data = { email, password }
    if (validateForm()) {
      showLoader(true)
      Axios.post('login', data)
        .then(response => {
          // Handle the response data here
          const options = setCookiesOptions()

          if (checked) {
            const exp = dayjs().add(30, 'day').startOf('day')
            setCookie('token', response.access_token, { ...options, expires: new Date(exp) })
          } else {
            setCookie('token', response.access_token, options)
          }
          router.push(baseUrl)
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

  const validateForm = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    const passwordMinLength = 6

    let hasErrors = false

    if (!values.email?.trim() || !emailPattern.test(values.email)) {
      setErrors(prevErrors => ({ ...prevErrors, email: 'Email is required' }))
      hasErrors = true
    }

    if (!values.password?.length) {
      setErrors(prevErrors => ({ ...prevErrors, password: 'Password is required' }))
      hasErrors = true
    }

    return !hasErrors
  }

  const handleEnterKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleLogin()
    }
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>

          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5, textAlign: 'center' }}>
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2' className='text-center'>
              Please sign-in to your account and start the adventure
            </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <CustomInput
              autoFocus
              value={values.email}
              onChange={handleChange('email')}
              fullWidth
              id='email'
              label='Email'
              error={!!errors.email}
              helperText={errors.email}
              sx={{ marginBottom: 4 }}
              onKeyDown={handleEnterKeyPress}
            />
            <FormControl fullWidth error={!!errors.password}>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-login-password'
                onChange={handleChange('password')}
                error={!!errors.password}
                type={values.showPassword ? 'text' : 'password'}
                onKeyDown={handleEnterKeyPress}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText className='MuiFormHelperText-root'>
                {errors.password ? errors.password : ''}
              </FormHelperText>
            </FormControl>
            <Box
              sx={{
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'space-between'
              }}
            >
              <FormControlLabel control={<Checkbox onChange={handleChecked} checked={checked} />} label='Remember Me' />
            </Box>
            <CustomButton
              loading={loader}
              variant='contained'
              sx={{ marginRight: 3.5, marginBottom: 5 }}
              onClick={handleLogin}
              loadingProps={{ size: 26 }}
            >
              Login
            </CustomButton>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                New on our platform?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/register'>
                  <LinkStyled>Create an account</LinkStyled>
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

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

export default LoginPage
