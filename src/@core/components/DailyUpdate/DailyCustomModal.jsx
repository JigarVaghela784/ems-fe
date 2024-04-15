import React from 'react'
import CustomModal from '../CustomModal'
import UpdateInfo from './UpdateInfo'

const DailyCustomModal = ({ selectedUpdate, setOpen }) => {
  return (
    <CustomModal open handleClose={() => setOpen(null)} dialogContentProps={{ style: { minWidth: '600px' } }}>
      <UpdateInfo item={selectedUpdate} isModal />
    </CustomModal>
  )
}

export default DailyCustomModal
