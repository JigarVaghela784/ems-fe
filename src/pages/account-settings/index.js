// ** React Imports
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import TabAccount from 'src/views/account-settings/TabAccount'
import TabSecurity from 'src/views/account-settings/TabSecurity'
import { getCookie } from 'cookies-next'
import { loginUrl } from 'utils/consts'
import { BankOutline, BriefcaseOutline } from 'mdi-material-ui'
import ExperienceInfo from '../../views/account-settings/ExperienceInfo'
import BankInfo from '../../views/account-settings/BankInfo'
import { useUserStore } from '../../store/user'
import Tabs from '../../components/Tabs'

const AccountSettings = () => {
  // ** State
  const [value, setValue] = useState('account')
  const { user, setUser } = useUserStore()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Card style={{ minHeight: '75vh' }}>
      <Tabs
        variant='scrollable'
        allowScrollButtonsMobile
        value={value}
        className='profile-tabs'
        handleChange={handleChange}
        tabList={[
          {
            value: 'account',
            label: 'Account',
            icon: <AccountOutline />,
            content: <TabAccount data={user} setUser={setUser} />
          },
          {
            value: 'security',
            label: 'Security',
            icon: <LockOpenOutline />,
            content: <TabSecurity data={user} />
          },
          {
            value: 'experience',
            label: 'Experience',
            icon: <BriefcaseOutline />,
            content: <ExperienceInfo data={user} setUser={setUser} />
          },
          {
            value: 'bank',
            label: 'Bank',
            icon: <BankOutline />,
            content: <BankInfo data={user} setUser={setUser} />
          }
        ]}
      />
    </Card>
  )
}

export async function getServerSideProps(props) {
  const id = getCookie('token', props)
  if (!id) {
    return {
      redirect: {
        destination: loginUrl
      }
    }
  }

  return {
    props: {}
  }
}

export default AccountSettings
