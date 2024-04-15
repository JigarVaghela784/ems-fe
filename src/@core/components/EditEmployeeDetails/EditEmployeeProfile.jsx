import React, { useEffect, useState } from 'react'
import CustomModal from '../CustomModal'
import { CloseCircle } from 'mdi-material-ui'
import { Button, Avatar, Tooltip } from '@mui/material'
import ProfileDetails from '../Forms/ProfileDetails'
import { Axios } from '../../../../api/axios'
import { toast } from 'react-toastify'
import AvatarUploadModal from 'src/components/AvatarUploadModal'

const EditEmployeeProfile = ({ open, userData, setEditProfileModal, handleSave, profileAvatar }) => {
  const [values, setValues] = useState({})
  const { avatar = '' } = values || {}
  const [updateLoading, setUpdateLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [imageObj, setImageObj] = useState(null)

  useEffect(() => {
    if (userData) {
      setValues({ ...userData })
    }
  }, [userData])

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleUpdate = async () => {
    setUpdateLoading(true)
    if (imageObj) {
      const formData = new FormData()
      formData.append('file', imageObj)
      try {
        const url = await Axios.post(`/upload/media`, formData)
        values.profile = url
        setValues({ ...values, profile: url })
      } catch (e) {
        toast.error(e?.response?.data?.message || e.message)

        return
      }
      setImageObj(null)
    }
    Axios.patch('user/edit', { ...values })
      .then(response => {
        toast.success('User updated successfully')
      })
      .catch(error => {
        if (error) {
          const errorMsg = error?.response?.data?.message || error?.message
          toast.error(errorMsg)
        }
      })

    handleSave(values)
    setUpdateLoading(false)
    setEditProfileModal(false)
  }

  const handleFileSave = async (url, image) => {
    setIsVisible(false)
    setValues({ ...values, profile: url ? url : null })
    setImageObj(image)
  }

  const handleReset = () => {
    setValues({ ...values, profile: null })
  }

  return (
    <div>
      <CustomModal
        open={open}
        handleClose={() => setEditProfileModal(null)}
        handleSave={handleUpdate}
        title={'Edit Profile Details'}
        onOkText={'Update'}
        loading={updateLoading}
        loadingProps={{ size: 25 }}
        DialogActionsProps={{ classes: { root: 'pt-10' } }}
      >
        <AvatarUploadModal
          setIsVisible={setIsVisible}
          isVisible={isVisible}
          aspect={1}
          isImageCrop
          handleSave={(url, image) => handleFileSave(url, image)}
        />
        <div className='edit-profile-wrapper'>
          <div>
            {values.profile && (
              <Tooltip title='Remove Avatar' placement='top'>
                <div className='removeIcon' onClick={handleReset}>
                  <CloseCircle />
                </div>
              </Tooltip>
            )}

            <Avatar className='edit-profile-image' alt='Flora' src={values?.profile ?? profileAvatar} />
          </div>

          <Button
            component='label'
            variant='contained'
            htmlFor='account-settings-upload-image'
            onClick={() => setIsVisible(true)}
          >
            Upload New Photo
          </Button>
        </div>
        <ProfileDetails values={values} handleChange={handleChange} isAdmin />
      </CustomModal>
    </div>
  )
}

export default EditEmployeeProfile
