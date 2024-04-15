import React, { useEffect, useState } from 'react'
import CustomModal from '../CustomModal'
import UserBankForm from './UserBankForm'
import { Axios } from '../../../../api/axios'
import { toast } from 'react-toastify'
import { ifscRegex, panRegex } from '../../../../utils/helper'

const UserBankInfo = ({ open, setShowBankInfoModal, bankData, handleSave }) => {
  const [values, setValues] = useState({})
  const [updateLoading, setUpdateLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (bankData) {
      setValues({ ...bankData })
    }
  }, [bankData])

  const validateForm = val => {
    const value = val || values

    const accountNumberRegex = /^\d{9,18}$/

    const errors = {}
    if (!value.bankName) {
      errors.bankName = 'BankName is required'
    }
    if (!value.ACNumber) {
      errors.ACNumber = 'ACNumber is required'
    } else if (!accountNumberRegex.test(value.ACNumber)) {
      errors.ACNumber = 'Please enter a valid ACNumber'
    }
    if (!value.ifsc) {
      errors.ifsc = 'IFSC is required'
    } else if (!ifscRegex.test(value.ifsc)) {
      errors.ifsc = 'Please enter a valid IFSC'
    }
    if (!value.panNo) {
      errors.panNo = 'PanNo is required'
    } else if (!panRegex.test(value.panNo)) {
      errors.panNo = 'Please enter a valid PanNo'
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors)

      return false
    }
    setErrors({})

    return true
  }

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
    validateForm({ ...values, [prop]: event.target.value })
  }

  const handleUpdate = async () => {
    if (validateForm()) {
      setUpdateLoading(true)
      try {
        await Axios.patch('user/edit', values)
        toast.success('User bank information updated successfully')
      } catch (e) {
        toast.error(e?.response?.data?.message || e.message)
      }
      handleSave(values)
      setUpdateLoading(false)
      setShowBankInfoModal(false)
    }
  }

  const handleClose = () => {
    setShowBankInfoModal(false)
    setErrors({})
  }

  return (
    <div>
      <CustomModal
        open={open}
        handleClose={handleClose}
        handleSave={handleUpdate}
        title={'Bank Information'}
        loading={updateLoading}
        loadingProps={{ size: 25 }}
        onOkText={'Submit'}
      >
        <UserBankForm handleChange={handleChange} values={values} errors={errors} />
      </CustomModal>
    </div>
  )
}

export default UserBankInfo
