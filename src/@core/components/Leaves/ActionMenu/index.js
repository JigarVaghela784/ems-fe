import React, { useState } from 'react'
import { DotsVertical, Pencil, TrashCanOutline } from 'mdi-material-ui'
import { Box, Menu, MenuItem } from '@mui/material'
import dayjs from 'dayjs'
import { getFormattedDate } from 'utils/helper'

const ActionMenu = ({
  handleDropdownOpen,
  isOpenModal,
  setIsOpenModal,
  tableRows,
  selectedRowValue,
  setUserData,
  isOpenRemoveModal,
  setIsOpenRemoveModal,
  params,
  isEmployee
}) => {
  const [anchorEl, setAnchorEl] = useState(false)

  return (
    <>
      <DotsVertical
        sx={{ cursor: 'pointer' }}
        onClick={event => {
          setAnchorEl(event.currentTarget)
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null)
        }}
        sx={{
          '& .MuiMenu-paper': {
            width: 230,
            marginTop: 4,
            boxShadow: '0px 2px 10px 0px rgba(58, 53, 65, 0.1)'
          }
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          sx={{ p: 0 }}
          onClick={() => {
            setAnchorEl(null)
            setIsOpenModal({ open: !isOpenModal.open, name: 'edit' })
            const user = tableRows.find(row => row.id === params.id)

            const totalDays =
              user?.from && user?.to && dayjs(user.from).isBefore(dayjs(user.to))
                ? (dayjs(user.to).diff(user.from, 'day') + 1).toString()
                : '1'

            setUserData({
              empId: user?.user?.id,
              leaveType: user?.leaveType,
              from: user?.from ? getFormattedDate(user.from) : null,
              to: user?.to ? getFormattedDate(user.to) : null,
              noOfDay: totalDays,
              reason: user?.reason,
              id: user?.id,
              status: user?.status
            })
          }}
        >
          <Box className='actionMenu'>
            <Pencil sx={{ marginRight: 2 }} />
            Edit
          </Box>
        </MenuItem>
        <MenuItem
          sx={{ p: 0 }}
          onClick={() => {
            setAnchorEl(null)
            setIsOpenRemoveModal(!isOpenRemoveModal)
          }}
        >
          {!isEmployee && (
            <Box className='actionMenu'>
              <TrashCanOutline sx={{ marginRight: 2 }} />
              Delete
            </Box>
          )}
        </MenuItem>
      </Menu>
    </>
  )
}

export default ActionMenu
