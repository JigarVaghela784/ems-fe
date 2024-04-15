import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, Avatar, Typography, Tooltip, IconButton } from '@mui/material'
import ClockTimeFiveOutline from 'mdi-material-ui/ClockTimeFiveOutline'
import Calendar from 'mdi-material-ui/Calendar'
import CustomButton from '../../layouts/components/shared-components/CustomButton'
import { stringToColor } from 'utils/helper'
import Delete from '../../../asset/image/Delete.svg'
import dayjs from 'dayjs'
import { useUserStore } from 'src/store/user'
import { renderText } from '../../layouts/components/shared-components/CustomSlate/serialize'
import { getContrastColor } from '../../../../utils/helper'
import Link from 'next/link'
import Pencil from 'mdi-material-ui/Pencil'
import CheckBold from 'mdi-material-ui/CheckBold'

const UpdateInfo = ({
  item,
  withProjectInfo,
  setSelectedUpdate,
  isModal,
  handleEditClick,
  handleSetDelete,
  handleSaveAsDraft,
  loadingAPI
}) => {
  const { user } = useUserStore()
  const [showFade, setShowFade] = useState()
  const renderTextRef = useRef()

  const handleShow = item => {
    setSelectedUpdate(item)
  }

  const isLogin = useMemo(() => {
    return item.employeeId === user.id
  }, [item, user])

  useEffect(() => {
    const clientHeight = renderTextRef?.current?.clientHeight
    const scrollHeight = renderTextRef?.current?.scrollHeight
    const isSameHeight = clientHeight >= scrollHeight
    setShowFade(!isSameHeight && withProjectInfo)
  }, [renderTextRef])

  return (
    <div className='updateInfoWrapper'>
      <Card variant='outlined' className={`${!withProjectInfo && !isModal ? 'mt-20' : ''}  daily-update-card`}>
        <div className='d-flex justify-between align-center pl-15 pr-15 pb-10 pt-10'>
          <div className='d-flex mt-15 '>
            <div>
              <Avatar />
            </div>
            <div className='ml-10 d-flex flex-column'>
              {' '}
              <Typography variant='subtitle2' color='text.secondary' className='them-color'>
                {item.employee.name}
              </Typography>
              <Typography className='update-text'>{dayjs(item.createdAt).format('hh:mm A')}</Typography>
            </div>
          </div>

          <div>
            {!isModal && (
              <div className='update-button'>
                {isLogin && (
                  <Tooltip title='Delete' placement='top'>
                    <IconButton
                      size='small'
                      fullWidth={false}
                      className='icon-btn'
                      onClick={() => handleSetDelete(item.id)}
                    >
                      <img src={Delete.src} alt='Delete' />
                    </IconButton>
                  </Tooltip>
                )}
                {isLogin && item.save_as_draft && (
                  <Tooltip title='Save draft value' placement='top'>
                    <IconButton
                      size='small'
                      fullWidth={false}
                      className='icon-btn'
                      loading={loadingAPI}
                      onClick={() => handleSaveAsDraft(item)}
                      disableRipple
                    >
                      <CheckBold />
                    </IconButton>
                  </Tooltip>
                )}
                {isLogin && (
                  <Tooltip title='Edit' placement='top'>
                    <IconButton
                      size='small'
                      fullWidth={false}
                      className='icon-btn'
                      onClick={() => handleEditClick(item)}
                      disableRipple
                    >
                      <Pencil />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>

        <CardContent className='them-color pt-10 pb-10 position-relative'>
          <div
            className='cursor-pointer'
            onClick={() => {
              if (setSelectedUpdate) handleShow(item)
            }}
          >
            <div
              className='cursor-pointer render-update-wrapper'
              ref={renderTextRef}
              style={{ height: withProjectInfo ? 80 : 'auto' }}
            >
              {item?.updates?.map((item, i) => renderText(item))}
            </div>
            {showFade && <div className='fade-css' />}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UpdateInfo
