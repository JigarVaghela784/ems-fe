// ** Next Imports
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import '../../styles/index.scss'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'react-toastify/dist/ReactToastify.css'

// ** Global css styles
import '../../styles/globals.css'
import { ToastContainer } from 'react-toastify'
import { useMemo } from 'react'
import { getCookie } from 'cookies-next'
import { baseUrl, loginUrl } from 'utils/consts'

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const router = useRouter()

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  // const isLoggedIn = useMemo(() => {
  //   return getCookie('token')
  // }, [router.pathname])

  // if (isLoggedIn && router.pathname === loginUrl) {
  //   router.push(baseUrl)
  // }

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName}`}</title>
        <meta
          name='description'
          content={`Employee Mangement System. It refers to a suite of software that organizations use to manage internal HR functions.`}
        />
        <meta name='keywords' content='Employee Mangement System' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      <SettingsProvider>
        <SettingsConsumer>
          {({ settings }) => {
            return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
          }}
        </SettingsConsumer>
      </SettingsProvider>
    </CacheProvider>
  )
}

export default App
