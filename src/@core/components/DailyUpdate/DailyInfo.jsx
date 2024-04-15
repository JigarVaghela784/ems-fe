import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import CustomButton from '../../layouts/components/shared-components/CustomButton'
import AddDailyInfo from './AddDailyInfo'
import UpdateInfo from './UpdateInfo'
import DailySearch from './DailySearch'
import Grid from '@mui/material/Grid'
import DailyCustomModal from './DailyCustomModal'
import { useRouter } from 'next/router'
import RemoveWarningModal from 'src/@core/layouts/components/shared-components/RemoveWarningModal'
import { Axios } from 'api/axios'
import { toast } from 'react-toastify'
import { useUserStore } from 'src/store/user'
import cs from 'classnames'
import NoData from 'src/components/NoData'

const DailyInfo = ({
  grid = 4,
  withProjectInfo,
  dailyInfo = [],
  update = {},
  handleSave,
  updatedData,
  handleDelete,
  isUserProfile,
  isDashboard
}) => {
  const router = useRouter()
  const [isOpenModal, setIsOpenModal] = useState({ open: false, name: '' })
  const [selectedUpdate, setSelectedUpdate] = useState(null)
  const [dailyUpdateDeleteId, setDailyUpdateDeleteId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [loadingAPI, setLoadingAPI] = useState(false)
  const [filteredUpdateData, setFilteredUpdateData] = useState(update)

  const { user } = useUserStore()

  const { projectId, userId } = router.query

  useEffect(() => {
    setFilteredUpdateData(update)
  }, [update])

  const handleCloseModal = () => {
    setIsOpenModal({ open: !isOpenModal.open, name: 'edit' })
    setIsOpenModal({ open: false, name: '' })
  }

  const handleEditClick = obj => {
    setIsOpenModal({ open: !isOpenModal.open, name: 'edit', ...obj })
  }

  const handleSetDelete = id => setDailyUpdateDeleteId(id)
  const handleCloseDelete = () => setDailyUpdateDeleteId(null)

  const handleDeleteUpdate = async () => {
    setDeleteLoading(true)
    try {
      await Axios.delete(`project-update/delete/${dailyUpdateDeleteId}`)
      const updatedData = dailyInfo.filter(item => item.id !== dailyUpdateDeleteId)
      if (handleDelete) {
        handleDelete(updatedData)
      }
      toast.success('Update deleted successfully')
      handleCloseDelete()
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
    }
    setDeleteLoading(false)
  }

  const handleSaveAsDraft = async obj => {
    const payload = {
      ...obj,
      save_as_draft: false
    }
    setLoadingAPI(true)
    await Axios.patch('project-update/edit', payload)
      .then(data => {
        if (handleSave) {
          handleSave(data, 'saveAsDraft')
        }
        toast.success('Update saved successfully')
      })
      .catch(error => {
        console.log(error)
        setLoadingAPI(false)
      })
  }

  return (
    <div className='daily-info-wrapper w-full'>
      <div>
        <div className={cs('d-flex justify-between', { ['is-dashboard-updates']: isDashboard })}>
          <CardHeader className='them-color' title={<span style={{ width: 'fit-content' }}>Daily Update</span>} />
          <CardContent className='them-color'>
            {(!isUserProfile || (isUserProfile && user?.id === userId)) && (
              <CustomButton
                sx={{ marginTop: 5 }}
                fullWidth
                size='large'
                variant='contained'
                onClick={() => {
                  setIsOpenModal({ open: !isOpenModal.open, name: 'add' })
                }}
              >
                Add Update
              </CustomButton>
            )}
          </CardContent>
        </div>

        {!withProjectInfo && (
          <DailySearch updatedData={updatedData} setFilteredUpdateData={setFilteredUpdateData} update={update} />
        )}
        <div className='m-20'>
          <Grid container spacing={6}>
            <>
              {Object.keys(filteredUpdateData).length > 0 ? (
                <>
                  {' '}
                  {Object.keys(filteredUpdateData).map(item => (
                    <>
                      <Grid item xs={12}>
                        <div className='daily-update'>
                          <div className='daily-update-date'>
                            <Typography className='update-date'>{item}</Typography>
                          </div>
                        </div>
                      </Grid>
                      {filteredUpdateData[item].map(value => (
                        <Grid item lg={grid} xs={12} key={value.id}>
                          <UpdateInfo
                            withProjectInfo={withProjectInfo}
                            item={value}
                            setSelectedUpdate={setSelectedUpdate}
                            handleEditClick={handleEditClick}
                            handleSetDelete={handleSetDelete}
                            handleSaveAsDraft={handleSaveAsDraft}
                          />
                        </Grid>
                      ))}
                    </>
                  ))}
                </>
              ) : (
                <div className='w-full mt-30'>
                  <NoData description={'No Data Found'} />
                </div>
              )}
            </>
          </Grid>
        </div>
      </div>

      {selectedUpdate && <DailyCustomModal selectedUpdate={selectedUpdate} setOpen={setSelectedUpdate} />}

      {isOpenModal.open && (
        <AddDailyInfo
          pid={projectId}
          isOpenModal={isOpenModal}
          handleCloseModal={handleCloseModal}
          handleSave={handleSave}
          withProjectInfo={withProjectInfo}
        />
      )}

      {!!dailyUpdateDeleteId && (
        <RemoveWarningModal
          customButtonProps={{ loading: deleteLoading }}
          message='Are you sure?'
          onClose={handleCloseDelete}
          onConfirm={handleDeleteUpdate}
        />
      )}
    </div>
  )
}

export default DailyInfo
