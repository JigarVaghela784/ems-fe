import { CardContent } from '@mui/material'
import React from 'react'
import ExperienceList from './ExperienceList'
import { PlusCircle } from 'mdi-material-ui'

const ExperienceForm = ({ entries, handleRemoveEntry, handleChange, handleAddEntry }) => {
  return (
    <>
      <CardContent>
        {entries?.map((entry, index) => (
          <ExperienceList entry={entry} key={index} handleRemoveEntry={handleRemoveEntry} handleChange={handleChange} />
        ))}
      </CardContent>

      <div className='add-more-button' onClick={handleAddEntry}>
        <PlusCircle /> {entries.length > 0 ? 'Add More' : 'Add'}
      </div>
    </>
  )
}

export default ExperienceForm
