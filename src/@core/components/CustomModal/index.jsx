import { Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material'
import React from 'react'
import cs from 'classnames'
import CustomButton from '../../layouts/components/shared-components/CustomButton'

const CustomModal = ({
  open,
  handleDelete = () => {},
  handleSave = () => {},
  handleClose,
  title,
  onOkText,
  onCancelText,
  cancelButtonProps = {},
  okButtonProps = {},
  dialogContentProps = {},
  loading,
  loadingProps,
  children,
  DialogActionsProps,
  dialogClass
}) => {
  return (
    <Dialog open={open} onClose={handleClose} className={cs({ [dialogClass]: dialogClass })}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent {...dialogContentProps}>{children}</DialogContent>
      {(onCancelText || onOkText) && (
        <DialogActions {...DialogActionsProps}>
          {onCancelText && (
            <CustomButton variant='outlined' onClick={handleDelete} {...cancelButtonProps}>
              {onCancelText}
            </CustomButton>
          )}
          {onOkText && (
            <CustomButton
              component='label'
              variant='contained'
              loading={loading}
              onClick={handleSave}
              loadingProps={loadingProps}
              {...okButtonProps}
            >
              {onOkText}
            </CustomButton>
          )}
        </DialogActions>
      )}
    </Dialog>
  )
}

export default CustomModal
