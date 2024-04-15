import React, { useEffect, useMemo, useState } from 'react'

import { CardContent, Grid } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import ExperienceForm from '../../@core/components/EditEmployeeDetails/ExperienceForm'
import CustomButton from '../../@core/layouts/components/shared-components/CustomButton'
import { Axios } from '../../../api/axios'
import { toast } from 'react-toastify'

const ExperienceInfo = ({ data, setUser }) => {
  const [entries, setEntries] = useState(data?.experiences || [])
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (data) {
      setValues({ ...data })
    }
    if (data?.experiences) {
      setEntries(data?.experiences)
    }
  }, [data])

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

  const handleSaveChanges = async () => {
    const { createdTime, ...payload } = values
    setLoading(true)
    Axios.patch('user/edit', { ...payload, experiences: entries })
      .then(response => {
        // Handle the response data here
        toast.success('User updated successfully')
        setLoading(false)
        setUser({ ...payload, experiences: entries })
      })
      .catch(error => {
        // Handle errors here
        if (error) {
          const errorMsg = error?.response?.data?.message || error?.message
          toast.error(errorMsg)
          setLoading(false)
        }
      })
  }

  const isEntriesData = useMemo(() => {
    return entries.some(entry => {
      return !entry.companyName || !entry.jobPosition || !entry.companyDOJ || !entry.companyDOR
    })
  }, [entries])

  return (
    <CardContent style={{ margin: '5px 0 0' }}>
      <ExperienceForm
        entries={entries}
        handleRemoveEntry={handleRemoveEntry}
        handleChange={handleChange}
        handleAddEntry={handleAddEntry}
      />
      <Grid item xs={12} sx={{ marginTop: '15px !important', ml: 5 }}>
        <CustomButton
          fullWidth={false}
          loading={loading}
          variant='contained'
          sx={{ marginRight: 3.5 }}
          onClick={handleSaveChanges}
          style={{ width: 172 }}
          loadingProps={{ size: 26 }}
          disabled={isEntriesData}
        >
          Save Changes
        </CustomButton>
      </Grid>
    </CardContent>
  )
}

export default ExperienceInfo
