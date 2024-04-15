import React from 'react'
import CustomModal from '../../../layouts/components/shared-components/CustomModal'

const AttendanceModal = ({ isOpen, setIsOpen, handleCloseModal }) => {
  return (
    <CustomModal open={isOpen.open} handleClose={handleCloseModal} title={'Attendance modal'}>
      <span>date: {isOpen.data.date}</span>
      <span>Arrived TIme:{isOpen.data['Arrived TIme']}</span>
      <span>Dept.Time: {isOpen.data['Dept.Time']}</span>
      <span>Working Hrs.:{isOpen.data['O.Times Hrs.']}</span>
      <span>O.Times Hrs.: {isOpen.data['Working Hrs.']}</span>
      <span>Status: {isOpen.data['Status']}</span>
    </CustomModal>
  )
}

export default AttendanceModal
