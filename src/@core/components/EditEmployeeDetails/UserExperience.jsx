import React, { useEffect, useMemo, useState } from 'react'
import CustomModal from '../CustomModal'
import { v4 as uuidv4 } from 'uuid'
import ExperienceForm from './ExperienceForm'
import { Axios } from '../../../../api/axios'
import { toast } from 'react-toastify'

const initialState = {
  id: uuidv4()
}

const UserExperience = ({ open, setShowExperienceModal, handleSave, userData }) => {
  const [entries, setEntries] = useState([initialState])
  const [values, setValues] = useState({})
  const [updateLoading, setUpdateLoading] = useState(false)

  useEffect(() => {
    if (userData) {
      setValues({ ...userData })
    }
    if (userData?.experiences) {
      setEntries(userData?.experiences)
    }
  }, [userData])

  const handleAddEntry = () => {
    setEntries([...entries, { id: uuidv4() }])
  }

  const handleRemoveEntry = id => {
    const updatedEntries = entries.filter(entry => entry.id !== id)
    setEntries(updatedEntries)
  }

  const handleChange = id => event => {
    const { value, name } = event?.target

    const updateEntries = entries.map(entry => {
      if (entry.id === id) {
        return { ...entry, [name]: value }
      }

      return entry
    })
    setEntries(updateEntries)
  }

  const handleUpdate = async () => {
    setUpdateLoading(true)
    const { createdTime, ...payload } = values
    handleSave(entries, 'experiences')

    try {
      await Axios.patch('user/edit', { ...values, experiences: entries })
      toast.success('User bank information updated successfully')
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
    }

    setUpdateLoading(false)
    setShowExperienceModal(false)
  }

  const isEntriesData = useMemo(() => {
    return entries.some(entry => {
      return !entry.companyName || !entry.jobPosition || !entry.companyDOJ || !entry.companyDOR
    })
  }, [entries])

  return (
    <CustomModal
      open={open}
      handleClose={() => setShowExperienceModal(null)}
      handleSave={handleUpdate}
      title={'Experience Information'}
      onOkText={'Submit'}
      loading={updateLoading}
      okButtonProps={{ disabled: isEntriesData }}
      loadingProps={{ size: 25 }}
      dialogContentProps={{ style: { minHeight: '65vh', minWidth: '600px' } }}
    >
      <ExperienceForm
        entries={entries}
        handleRemoveEntry={handleRemoveEntry}
        handleChange={handleChange}
        handleAddEntry={handleAddEntry}
      />
    </CustomModal>
  )
}

export default UserExperience
