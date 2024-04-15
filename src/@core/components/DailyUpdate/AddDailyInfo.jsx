import React, { useEffect, useMemo, useState } from 'react'
import CustomModal from '../../layouts/components/shared-components/CustomModal'
import CustomSlate from '../../layouts/components/shared-components/CustomSlate'
import CustomButton from '../../layouts/components/shared-components/CustomButton'
import CustomSelect from '../../layouts/components/shared-components/CustomSelect'
import { Axios } from 'api/axios'
import { toast } from 'react-toastify'
import { getIsEmpty } from '../../../../utils/helper'
import { useProjectStore } from 'src/store/project'

const AddDailyInfo = ({ isOpenModal = {}, handleCloseModal, handleSave, withProjectInfo, pid }) => {
  const { name, projectId, updates, id } = isOpenModal
  const [selectProject, setSelectProject] = useState(projectId || '')
  const [loadingAPI, setLoadingAPI] = useState(false)
  const [loading, setLoading] = useState(false)

  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: '' }]
    }
  ]
  const init = getIsEmpty(updates) ? initialValue : updates
  const [dailyUpdate, setDailyUpdate] = useState(init || initialValue)
  const { projectList, setProjectList } = useProjectStore()

  const projects = useMemo(() => {
    return projectList.map(item => {
      return {
        name: item.name,
        value: item.id
      }
    })
  }, [projectList])

  useEffect(() => {
    if (projectList.length > 0) return
    setLoading(true)
    Axios.get('project')
      .then(p => {
        if (p) {
          setProjectList(p)
        } else {
          setProjectList([])
        }
      })
      .catch(e => {
        toast.error(e?.response?.data?.message || e.message)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSaveClick = async isDraft => {
    const payload = { projectId: selectProject || pid }
    if (isDraft) {
      payload.save_as_draft = dailyUpdate
    } else {
      payload.updates = dailyUpdate
      payload.save_as_draft = null
    }

    setLoadingAPI(true)
    if (name === 'add') {
      await Axios.post('project-update/add', payload)
        .then(data => {
          if (handleSave) {
            handleSave(data, 'add')
          }
          toast.success('Update added successfully')
          handleCloseModal()
        })
        .catch(e => {
          console.log(e)
          toast.error(e?.response?.data?.message || e.message)
          setLoadingAPI(false)
        })
    } else {
      await Axios.patch('project-update/edit', { id, ...payload })
        .then(data => {
          if (handleSave) {
            handleSave(data, 'edit')
          }
          toast.success('Update edited successfully')
          handleCloseModal()
        })
        .catch(e => {
          console.log(e)
          toast.error(e?.response?.data?.message || e.message)
          setLoadingAPI(false)
        })
    }
  }

  const handleChange = e => {
    setSelectProject(e.target.value)
  }

  useEffect(() => {
    const data = getIsEmpty(updates) ? initialValue : updates
    setDailyUpdate(data || initialValue)
  }, [updates])

  return (
    <CustomModal
      width={800}
      open={true}
      handleClose={handleCloseModal}
      title={`${isOpenModal.name === 'edit' ? 'Edit Update' : 'Add Update'}`}
      className='daily-update-modal'
    >
      <div>
        {withProjectInfo && (
          <CustomSelect
            title='Select Project'
            value={selectProject}
            options={projects}
            sx={{ width: '250px' }}
            disabled={loading || name === 'edit'}
            onChange={e => handleChange(e)}
          />
        )}
      </div>
      <div>
        <CustomSlate
          initialValue={getIsEmpty(dailyUpdate) ? initialValue : dailyUpdate}
          value={getIsEmpty(dailyUpdate) ? initialValue : dailyUpdate}
          onChange={value => setDailyUpdate(value)}
        />
      </div>

      <div className='btn-DailyUpdate'>
        <div>
          <CustomButton
            fullWidth={false}
            color='secondary'
            variant='contained'
            sx={{ marginBottom: 7, width: 172 }}
            onClick={() => handleSaveClick(true)}
            loading={loadingAPI}
            loadingProps={{ size: 25.6 }}
          >
            Save as Draft
          </CustomButton>
        </div>
        <div>
          <CustomButton
            fullWidth={false}
            variant='contained'
            sx={{ marginBottom: 7, width: 92 }}
            onClick={() => handleSaveClick(false)}
            loading={loadingAPI}
            loadingProps={{ size: 25.6 }}
          >
            {isOpenModal.name === 'edit' ? 'Save' : 'Submit'}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  )
}

export default AddDailyInfo
