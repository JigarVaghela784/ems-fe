import React, { useEffect, useMemo, useState } from 'react'
import UserBankForm from '../../@core/components/EditEmployeeDetails/UserBankForm'
import { toast } from 'react-toastify'
import { Axios } from '../../../api/axios'
import { getUserRoles, ifscRegex, panRegex } from '../../../utils/helper'
import { useUserStore } from 'src/store/user'

const BankInfo = ({ data, setUser }) => {
  const [values, setValues] = useState(data)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { user } = useUserStore()
  const { isAdmin } = getUserRoles(user.role)
  useEffect(() => {
    setValues(data)
  }, [data])

  const isEdit = useMemo(() => {
    const { bankName = '', ACNumber = '', ifsc = '', panNo = '' } = data || {}

    return !bankName || !ACNumber || !ifsc || !panNo
  }, [data])

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

  const handleSaveChanges = async () => {
    if (validateForm()) {
      const { createdTime, ...payload } = values
      setLoading(true)
      Axios.patch('user/edit', payload)
        .then(response => {
          // Handle the response data here
          toast.success('User updated successfully')
          setLoading(false)
          setUser(payload)
        })
        .catch(error => {
          // Handle errors here
          if (error) {
            const errorMsg = error?.response?.data?.message || error?.message
            toast.error(errorMsg)
            setLoading(false)
          }
        })
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    handleSaveChanges()
  }

  return (
    <div className='p-20 pt-27'>
      <UserBankForm
        handleChange={handleChange}
        values={values}
        handleSaveChanges={handleSaveChanges}
        loading={loading}
        disabled={!isEdit && !isAdmin}
        handleSubmit={handleSubmit}
        errors={errors}
      />
    </div>
  )
}

export default BankInfo
