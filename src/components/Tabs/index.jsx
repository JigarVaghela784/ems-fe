import React from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import TabAccount from '../../views/account-settings/TabAccount'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'

const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const Tabs = ({ value, handleChange, tabList, className, variant = 'scrollable', allowScrollButtonsMobile = true }) => {
  return (
    <TabContext value={value}>
      <TabList
        variant={variant}
        allowScrollButtonsMobile={allowScrollButtonsMobile}
        className={className}
        onChange={handleChange}
        aria-label='account-settings tabs'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        {tabList.map((tab, i) => (
          <Tab
            key={`tabList-${i}`}
            value={tab.value}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {tab.icon && tab.icon}
                <TabName>{tab.label}</TabName>
              </Box>
            }
          />
        ))}
      </TabList>

      {tabList.map((tab, i) => (
        <TabPanel key={`tabPanel-${i}`} sx={{ p: 0 }} value={tab.value}>
          {tab.content}
        </TabPanel>
      ))}
    </TabContext>
  )
}

export default Tabs
