import React, { useEffect } from 'react'
import WarningIcon from '../../../../../asset/image/warningIcon.svg'
import cs from 'classnames'
import { Close } from 'mdi-material-ui'
import CustomButton from '../CustomButton'
import Typography from '@mui/material/Typography'
import { Portal } from '../Portal'

const RemoveWarningModal = ({
  onConfirm,
  onClose,
  message = '',
  subtitle = 'This cannot be undone.',
  confirmButtonText = 'Remove',
  cancelText = 'Cancel',
  customButtonProps = {},
  isResponseWarning = false,
  confirmOnEnterClick = true,
  contentWrapperClassName = '',
  titleClassName = ''
}) => {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyUp)
    }
  }, [])

  const handleKeyUp = event => {
    if (event.keyCode === 13) {
      confirmOnEnterClick && onConfirm()
    }
    if ([27, 8].includes(event.keyCode)) {
      if (onClose) onClose()
    }
  }

  return (
    <Portal>
      <div
        className='w-full remove-attribute-modal d-flex align-center justify-center'
        onClick={e => {
          e.stopPropagation()
          if (onClose) onClose()
        }}
      >
        <div
          className={cs(
            'remove-attribute-modal__content',
            {
              ['remove-response-modal']: isResponseWarning
            },
            { [contentWrapperClassName]: contentWrapperClassName }
          )}
          onClick={e => {
            e.stopPropagation()
          }}
        >
          {isResponseWarning && (
            <div className='text-end'>
              <span className='remove-attribute-modal__closeIcon'>
                <Close
                  onClick={e => {
                    e.stopPropagation()
                    onClose()
                  }}
                />
              </span>
            </div>
          )}
          <div
            className={cs('remove-attribute-modal__message mb-22', {
              ['mb-50']: isResponseWarning
            })}
          >
            {!isResponseWarning && (
              <div className='warningIcon'>
                <img src={WarningIcon.src} alt='WarningIcon' />
              </div>
            )}
            <Typography
              className={cs('typography-16-regular', {
                ['typography-22-regular d-flex mb-20 ']: isResponseWarning
              })}
            >
              {message}
            </Typography>
            <Typography
              className={cs(
                'typography-14-regular c-grey-600 remove-attribute-modal__subtitle',
                { ['response-warning-message']: isResponseWarning },
                { [titleClassName]: titleClassName }
              )}
            >
              {subtitle}
            </Typography>
          </div>
          <div
            className={cs('remove-attribute-modal__btns d-flex align-center justify-center', {
              ['justify-end']: isResponseWarning
            })}
          >
            <div className={cs('d-flex', { ['w-full']: !isResponseWarning })}>
              <CustomButton onClick={onClose} classes={{ root: 'w-full remove-attribute-modal__btn mr-10' }}>
                {cancelText}
              </CustomButton>
              <CustomButton
                onClick={onConfirm}
                classes={{ root: 'w-full remove-attribute-modal__btn mr-10' }}
                {...customButtonProps}
              >
                {confirmButtonText}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  )
}

export default RemoveWarningModal
