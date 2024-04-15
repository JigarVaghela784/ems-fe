import React from 'react'
import { CardContent, TextField, Grid, Typography } from '@mui/material'
import CustomButton from '../../layouts/components/shared-components/CustomButton'
import CustomInput from '../../../components/CustomInput'

const UserBankForm = ({ handleChange, values, handleSaveChanges, loading, handleSubmit, errors, disabled = false }) => {
  const { bankName = '', ACNumber = '', ifsc = '', panNo = '' } = values || {}

  return (
    <CardContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={7}>
          <Grid item xs={12}>
            <CustomInput
              fullWidth
              label='Bank Name'
              onChange={handleChange('bankName')}
              placeholder='Bank Name'
              value={bankName}
              disabled={disabled}
              error={!!errors.bankName}
            />
            {errors?.bankName ? (
              <Typography variant='body2' color='error'>
                {errors?.bankName}
              </Typography>
            ) : (
              ''
            )}
          </Grid>

          <Grid item xs={12}>
            <CustomInput
              fullWidth
              label='Account Number'
              onChange={handleChange('ACNumber')}
              type='number'
              placeholder='Account Number'
              value={ACNumber}
              disabled={disabled}
              error={!!errors.ACNumber}
            />

            {errors?.ACNumber ? (
              <Typography variant='body2' color='error'>
                {errors?.ACNumber}
              </Typography>
            ) : (
              ''
            )}
          </Grid>

          <Grid item xs={12}>
            <CustomInput
              fullWidth
              label='IFSC Code'
              onChange={handleChange('ifsc')}
              placeholder='IFSC Code'
              value={ifsc}
              disabled={disabled}
              error={!!errors.ifsc}
            />

            {errors?.ifsc ? (
              <Typography variant='body2' color='error'>
                {errors?.ifsc}
              </Typography>
            ) : (
              ''
            )}
          </Grid>
          <Grid item xs={12}>
            <CustomInput
              fullWidth
              label='PAN Number'
              onChange={handleChange('panNo')}
              placeholder='PAN Number'
              value={panNo}
              disabled={disabled}
              error={!!errors.panNo}
            />

            {errors?.panNo ? (
              <Typography variant='body2' color='error'>
                {errors?.panNo}
              </Typography>
            ) : (
              ''
            )}
          </Grid>
          {!!handleSaveChanges && !disabled && (
            <Grid item xs={12}>
              <CustomButton
                fullWidth={false}
                loading={loading}
                variant='contained'
                sx={{ marginRight: 3.5 }}
                onClick={handleSaveChanges}
                style={{ width: 172 }}
                loadingProps={{ size: 26 }}
                type='submit'
              >
                Save Changes
              </CustomButton>
            </Grid>
          )}
        </Grid>
      </form>
    </CardContent>
  )
}

export default UserBankForm
