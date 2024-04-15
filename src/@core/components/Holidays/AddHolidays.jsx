import React from 'react'
import CustomModal from '../../layouts/components/shared-components/CustomModal'
import CustomButton from '../../layouts/components/shared-components/CustomButton'
import CustomDatePicker from '../../layouts/components/shared-components/CustomDatePicker'
import CustomInput from '../../../components/CustomInput'
import dayjs from 'dayjs'
import { getFormattedDate } from 'utils/helper'

const AddHolidays = ({ handleCloseModal, isOpenModal, userData, setUserData, handleSave, loading }) => {
  return (
    <CustomModal
      open={true}
      handleClose={handleCloseModal}
      title={`${isOpenModal.name === 'edit' ? 'Edit Holiday' : 'Add Holiday'}`}
      className='holiday-form'
    >
      <form>
        <CustomInput
          autoFocus
          fullWidth
          id='name'
          label='Holiday Name'
          sx={{ marginBottom: 4 }}
          value={userData.title}
          onChange={e => setUserData({ ...userData, title: e.target.value })}
        />

        <CustomDatePicker
          label='Holiday Date'
          selected={userData.date}
          value={userData.date ? dayjs(userData.date) : null}
          minDate={dayjs(userData.date || new Date()).add(0, 'day')}
          onChange={newValue => setUserData({ ...userData, date: getFormattedDate(newValue) })}
        />

        <CustomButton
          fullWidth
          size='large'
          loading={loading}
          variant='contained'
          sx={{ marginBottom: 7, marginTop: 12, minWidth: '200px' }}
          disabled={!userData.title || !userData.date}
          onClick={handleSave}
          loadingProps={{ size: 26 }}
        >
          {isOpenModal.name === 'edit' ? 'Save' : 'Submit'}
        </CustomButton>
      </form>
    </CustomModal>
  )
}

export default AddHolidays
