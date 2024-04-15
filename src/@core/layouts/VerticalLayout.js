// ** React Imports
import React, { useEffect, useState } from 'react'

// ** MUI Imports
import Fab from '@mui/material/Fab'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// ** Icons Imports
import ArrowUp from 'mdi-material-ui/ArrowUp'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Components
import AppBar from './components/vertical/appBar'
import Navigation from './components/vertical/navigation'
import Footer from './components/shared-components/footer'
import ScrollToTop from 'src/@core/components/scroll-to-top'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Axios } from '../../../api/axios'
import FullPageLoading from './components/shared-components/FullPageLoading'
import { useUserStore } from '../../store/user'
import { toast } from 'react-toastify'
import { checkIsValidPage, getFormattedDate } from '../../../utils/helper'

const VerticalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex'
})

const MainContentWrapper = styled(Box)({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const toasterErrorMessage = 'Something went wrong please try again after sometime'

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const VerticalLayout = props => {
  // ** Props
  const { settings, children, scrollToTop } = props

  // ** Vars
  const { contentWidth } = settings
  const navWidth = themeConfig.navigationSize
  const { setUser, setEvents } = useUserStore()

  // ** States
  const [navVisible, setNavVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // ** Toggle Functions
  const toggleNavVisibility = () => setNavVisible(!navVisible)

  useEffect(() => {
    setLoading(true)
    Axios.get('user')
      .then(data => {
        setUser({ ...data })
        const isValidPage = checkIsValidPage(data.role, window.location.pathname)
        if (isValidPage) {
          setLoading(false)
        } else {
          window.location.href = '/'
        }
      })
      .catch(e => {
        toast(toasterErrorMessage)
      })

    const date = getFormattedDate()

    // Axios.get(`event/today-event?date=${date}`)
    //   .then(data => {
    //     setEvents(data)
    //   })
    //   .catch(e => {
    //     toast(toasterErrorMessage)
    //   })
  }, [setEvents, setUser])

  if (loading) {
    return <FullPageLoading />
  }

  return (
    <>
      <VerticalLayoutWrapper className='layout-wrapper'>
        <Navigation
          navWidth={navWidth}
          navVisible={navVisible}
          setNavVisible={setNavVisible}
          toggleNavVisibility={toggleNavVisibility}
          {...props}
        />
        <MainContentWrapper className='layout-content-wrapper'>
          <AppBar toggleNavVisibility={toggleNavVisibility} {...props} />

          <ContentWrapper
            className='layout-page-content'
            sx={{
              ...(contentWidth === 'boxed' && {
                mx: 'auto',
                '@media (min-width:1440px)': { maxWidth: 1440 },
                '@media (min-width:1200px)': { maxWidth: '100%' }
              })
            }}
          >
            {children}
          </ContentWrapper>

          {/*<Footer {...props} />*/}

          <DatePickerWrapper sx={{ zIndex: 11 }}>
            <Box id='react-datepicker-portal' />
          </DatePickerWrapper>
        </MainContentWrapper>
      </VerticalLayoutWrapper>

      {scrollToTop ? (
        scrollToTop(props)
      ) : (
        <ScrollToTop className='mui-fixed'>
          <Fab color='primary' size='small' aria-label='scroll back to top' className='scrollTopFab'>
            <ArrowUp />
          </Fab>
        </ScrollToTop>
      )}
    </>
  )
}

export default VerticalLayout
