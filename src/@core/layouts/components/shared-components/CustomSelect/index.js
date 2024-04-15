import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'

const CustomSelect = ({ title, id, options, handleChange, multiple = false, ...rest }) => {
  if (multiple) {
    return (
      <FormControl fullWidth>
        <InputLabel id={id}>{title}</InputLabel>
        <Select
          id={`${id}-select`}
          label={title}
          multiple
          renderValue={selected => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {options
                .filter(o => selected.includes(o.value))
                .map(d => (
                  <Chip key={d.value} label={d.name || d.label} />
                ))}
            </Box>
          )}
          {...rest}
          onChange={async event => {
            const {
              target: { value }
            } = event
            const output = typeof value === 'string' ? value.split(',') : value
            if (rest.onChange) rest.onChange(output)
            if (handleChange) handleChange(output)
          }}
          value={rest.value || []}
        >
          {options.map((option, i) => (
            <MenuItem
              value={option.value}
              key={i}
              sx={{ display: 'flex', flexFlow: 'row', gap: '5px', alignItems: 'center' }}
            >
              <Checkbox checked={rest.value.includes(option.value)} />
              {option.icons && option.icons}
              {option.name || option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }

  return (
    <FormControl fullWidth>
      <InputLabel id={id}>{title}</InputLabel>
      <Select id={`${id}-select`} label={title} onChange={handleChange} {...rest}>
        {options.map((option, i) => (
          <MenuItem
            value={option.value}
            key={i}
            sx={{ display: 'flex', flexFlow: 'row', gap: '5px', alignItems: 'center' }}
          >
            {option.icons && option.icons}
            {option.name || option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default CustomSelect
