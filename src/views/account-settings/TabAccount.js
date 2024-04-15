// ** React Imports
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import ProfileDetails from '../../@core/components/Forms/ProfileDetails'
import CustomButton from '../../@core/layouts/components/shared-components/CustomButton'
import { Axios } from '../../../api/axios'
import { toast } from 'react-toastify'
import CustomInput from '../../components/CustomInput'
import AvatarUploadModal from '../../components/AvatarUploadModal'
import { phoneRegex } from 'utils/helper'

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

const TabAccount = ({ data = {}, setUser }) => {
  const initialUserData = JSON.parse(JSON.stringify(data))
  delete initialUserData.createdTime
  const [updatedUser, setUpdatedUser] = useState(initialUserData)
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState(updatedUser?.profile)
  const [imageObj, setImageObj] = useState(null)

  const [errors, setErrors] = useState({
    phone: ''
  })

  useEffect(() => {
    setUpdatedUser(initialUserData)
  }, [data])

  useEffect(() => {
    setImgSrc(updatedUser?.profile || '/images/avatars/1.png')
  }, [updatedUser?.profile])

  const handleFormValueChange = prop => event => {
    setUpdatedUser({ ...updatedUser, [prop]: event.target.value })
    if (prop === 'phone') {
      setErrors({
        ...errors,
        phone: event.target.value
          ? !phoneRegex.test(event.target.value)
            ? 'Please enter a valid Phone Number'
            : ''
          : ''
      })
    }
  }

  const handleFileSave = async (url, image) => {
    setImgSrc(url)
    setImageObj(image)
    setIsVisible(false)
    setUpdatedUser({ ...updatedUser, profile: url ? url : null })
  }

  const handleSaveChanges = async () => {
    setLoading(true)

    if (imageObj) {
      const formData = new FormData()
      formData.append('file', imageObj)

      try {
        const url = await Axios.post(`/upload/media`, formData)
        updatedUser.profile = url
        setUpdatedUser({ ...updatedUser, profile: url })
      } catch (e) {
        toast.error(e?.response?.data?.message || e.message)

        return
      }
      if (updatedUser?.updatedAt) delete updatedUser['updatedAt']
      setImageObj(null)
    }
    Axios.patch('user/edit', { ...updatedUser })
      .then(response => {
        setUser({ ...updatedUser })
        toast.success('User updated successfully')
        setLoading(false)
      })
      .catch(error => {
        if (error) {
          const errorMsg = error?.response?.data?.message || error?.message
          toast.error(errorMsg)
          setLoading(false)
        }
      })
  }

  const handleEnterKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSaveChanges()
    }
  }

  const handleReset = () => {
    setUpdatedUser({ ...updatedUser, profile: null })
  }

  return (
    <CardContent>
      <AvatarUploadModal
        setIsVisible={setIsVisible}
        isVisible={isVisible}
        aspect={1}
        isImageCrop
        handleSave={(url, image) => handleFileSave(url, image)}
      />
      <form onSubmit={e => e.preventDefault()}>
        <Grid container style={{ width: '100%', margin: '-20px 0 20px' }} spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }} className='user-profile-pic'>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc ? imgSrc : '/images/avatars/1.png'} alt='Profile Pic' />
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
          </Grid>

          <CardContent className='w-full'>
            <Grid container spacing={7}>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  fullWidth
                  disabled
                  label='User Id'
                  placeholder='userId'
                  value={updatedUser.id}
                  onKeyDown={handleEnterKeyPress}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomInput
                  fullWidth
                  type='email'
                  label='Email'
                  placeholder='johnDoe@example.com'
                  disabled
                  value={updatedUser.email}
                  onKeyDown={handleEnterKeyPress}
                />
              </Grid>
            </Grid>
          </CardContent>
          <ProfileDetails
            handleChange={handleFormValueChange}
            values={updatedUser}
            handleEnterKeyPress={handleEnterKeyPress}
            errors={errors}
          />
          <Grid item xs={12} className='btn-Save'>
            <CustomButton
              fullWidth={false}
              loading={loading}
              variant='contained'
              sx={{ marginRight: 3.5 }}
              onClick={handleSaveChanges}
              style={{ width: 172 }}
              loadingProps={{ size: 26 }}
              disabled={errors.phone}
            >
              Save Changes
            </CustomButton>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
