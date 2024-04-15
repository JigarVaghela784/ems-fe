import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import { Pencil } from 'mdi-material-ui'
import UserBankInfo from '../EditEmployeeDetails/UserBankInfo'

const EmployeeBankInformation = ({ userData, handleSave }) => {
  const [showBankInfoModal, setShowBankInfoModal] = useState(null)
  const { bankName = '', ACNumber = '', ifsc = '', panNo = '' } = userData

  return (
    <>
      <div className='bank-section'>
        <div className='header-section'>
          <div className='title'>Bank information</div>
          <div>
            <IconButton
              size='small'
              aria-label='settings'
              className='card-more-options'
              sx={{ color: 'text.secondary' }}
              id='dropdown-settings'
              aria-haspopup='true'
              onClick={() => setShowBankInfoModal(!showBankInfoModal)}
              aria-controls='dropdown-settings'
            >
              <Pencil />
            </IconButton>
          </div>
        </div>
        <div className='bank-data'>
          <div className='bank-data-wrapper'>
            <span className='user-data-title'>Bank name :</span>
            <span className='user-data-details'>{bankName}</span>
          </div>
          <div className='bank-data-wrapper'>
            <span className='user-data-title'>Bank account No :</span>
            <span className='user-data-details'>{ACNumber}</span>
          </div>
          <div className='bank-data-wrapper'>
            <span className='user-data-title'>IFSC Code :</span>
            <span className='user-data-details'>{ifsc}</span>
          </div>
          <div className='bank-data-wrapper'>
            <span className='user-data-title'>PAN No :</span>
            <span className='user-data-details'>{panNo}</span>
          </div>
        </div>
      </div>

      <UserBankInfo
        open={showBankInfoModal}
        setShowBankInfoModal={setShowBankInfoModal}
        bankData={userData}
        handleSave={handleSave}
      />
    </>
  )
}

export default EmployeeBankInformation
