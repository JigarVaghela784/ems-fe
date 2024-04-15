import React, { useEffect, useMemo, useState } from 'react'
import CustomModal from '../../../layouts/components/shared-components/CustomModal'
import CustomSelect from '../../../layouts/components/shared-components/CustomSelect'
import { Box, TextField } from '@mui/material'
import dayjs from 'dayjs'
import { customHandleChange } from '../helper'
import { getFormattedDate, statusList } from '../../../../../utils/helper'
import { getUserRoles } from '../../../../../utils/helper'
import CustomButton from '../../../layouts/components/shared-components/CustomButton'
import CustomDatePicker from '../../../layouts/components/shared-components/CustomDatePicker'
import { Axios } from '../../../../../api/axios'
import { useUserStore } from '../../../../store/user'
import CustomInput from '../../../../components/CustomInput'
import { toast } from 'react-toastify'

const LeaveForm = ({
  isOpenModal,
  handleCloseModal,
  tableRows,
  setTableRows,
  userData,
  setUserData,
  selectedRowValue,
  setLeaves,
  leaves,
  isEmployee,
  setActiveType
}) => {
  const { user } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (!isEmployee) {
      setLoading(true)
      Axios.get('user/all?pageSize=0')
        .then(data => {
          setUsers(data.data)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isEmployee])

  const employeeList = useMemo(() => {
    return users?.filter(u => u.employeeStatus === 'active')?.map(u => ({ name: u.name, value: u.id }))
  }, [users])

  const leaveTypeOptions = [
    { name: 'Casual Leave', value: 'Casual Leave' },
    { name: 'Medical Leave', value: 'Medical Leave' },
    { name: 'Loss of Pay', value: 'Loss of Pay' }
  ]

  const isBtnDisabled =
    (!isEmployee
      ? !userData.empId ||
        !userData.leaveType ||
        !userData.from ||
        !userData.to ||
        !userData.noOfDay ||
        !userData.reason ||
        !userData.status
      : !userData.leaveType || !userData.from || !userData.to || !userData.noOfDay || !userData.reason) ||
    new Date(userData.from) > new Date(userData.to)

  const onSubmitHandler = async () => {
    const commonFormData = {
      empId: isEmployee ? user.id : userData.empId,
      leaveType: userData.leaveType,
      from: userData.from,
      to: userData.to,
      noOfDay: userData.noOfDay,
      reason: userData.reason,
      status: userData.status || 'pending'
    }
    setLoading(true)
    try {
      if (isOpenModal.name === 'add') {
        const employeeName = isEmployee ? user.name : users.find(user => user.id === userData.empId).name
        const response = await Axios.post('leave/add', { ...commonFormData })
        toast.success('Leave added successfully')
        setTableRows([
          ...tableRows,
          {
            id: response.id,
            employeeName,
            ...response
          }
        ])

        setLeaves([
          ...leaves,
          {
            id: response.id,
            employeeName,
            ...response
          }
        ])
        setActiveType(userData.status || 'pending')
      } else {
        const employeeName = isEmployee ? user.name : users.find(user => user.id === userData.empId).name
        const response = await Axios.patch('leave/update', { ...commonFormData, id: userData.id })
        toast.success('Leave updated successfully')

        const updatedLeaves = leaves.map(leaves => {
          if (leaves.id === selectedRowValue.id) {
            return {
              id: leaves.id,
              ...leaves,
              ...commonFormData,
              employeeName
            }
          } else {
            return leaves
          }
        })

        setLeaves(updatedLeaves)
        setActiveType(userData.status || 'pending')
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
    }

    setUserData({
      empId: '',
      leaveType: '',
      from: '',
      to: '',
      noOfDay: 0,
      remainingLeaves: 20,
      reason: '',
      status: ''
    })
    setLoading(false)
    handleCloseModal()
  }

  const isEditMode = isOpenModal.name === 'edit'

  return (
    <CustomModal
      open={isOpenModal.open}
      handleClose={handleCloseModal}
      title={`${isEditMode ? 'Edit Leave' : 'Add Leave'}`}
      className='leave-form scrollbar-css'
    >
      <Box sx={{ display: 'flex', flexFlow: 'column', gap: '15px' }}>
        {!isEmployee && (
          <CustomSelect
            title='Employee Name'
            id='userId'
            options={employeeList}
            value={userData.empId}
            handleChange={event => setUserData(customHandleChange(userData, 'empId', event.target.value))}
          />
        )}

        <CustomSelect
          title='Leave Type'
          id='leaveType'
          options={leaveTypeOptions}
          value={userData.leaveType}
          handleChange={event => setUserData(customHandleChange(userData, 'leaveType', event.target.value))}
        />
        {/* <LeaveStatus
          id='statusType'
          value={userData.status}
          handleChange={event => setUserData(customHandleChange(userData, 'status', event.target.value))}
        /> */}
        {!isEmployee && (
          <CustomSelect
            title='Status'
            id='statusType'
            options={statusList}
            value={userData.status}
            handleChange={event => setUserData(customHandleChange(userData, 'status', event.target.value))}
          />
        )}

        <CustomDatePicker
          label='From'
          value={userData.from ? dayjs(userData.from) : null}
          onChange={newValue => {
            const totalDays =
              newValue && userData.to && dayjs(newValue).isBefore(dayjs(userData.to))
                ? (dayjs(userData.to).diff(newValue, 'day') + 1).toString()
                : '1'

            setUserData({ ...userData, from: getFormattedDate(newValue), noOfDay: totalDays })
          }}
          minDate={isOpenModal.name === 'add' ? dayjs() : null}
          disabled={isEmployee && isEditMode}
        />

        <CustomDatePicker
          label='To'
          value={userData.to ? dayjs(userData.to) : null}
          onChange={newValue => {
            const totalDays =
              newValue && userData.from && dayjs(userData.from).isBefore(dayjs(newValue))
                ? (+newValue.diff(userData.from, 'day').toString() + 1).toString()
                : '1'

            setUserData({ ...userData, to: getFormattedDate(newValue), noOfDay: totalDays })
          }}
          minDate={dayjs(userData.from).add(0, 'day')}
          disabled={isEmployee && isEditMode}
        />

        <CustomInput disabled fullWidth id='noOfDay' label='Number of days' value={userData.noOfDay} />
        <CustomInput
          fullWidth
          id='leaveReason'
          label='Leave reason'
          multiline
          rows={4}
          value={userData.reason}
          onChange={e => setUserData(customHandleChange(userData, 'reason', e.target.value))}
        />

        <CustomButton
          fullWidth
          sx={{ marginBottom: 7, marginTop: 12, minWidth: '200px' }}
          disabled={isBtnDisabled}
          loading={loading}
          onClick={onSubmitHandler}
          loadingProps={{ size: 25 }}
        >
          {`${isEditMode ? 'Save' : 'Submit'}`}
        </CustomButton>
      </Box>
    </CustomModal>
  )
}

export default LeaveForm
