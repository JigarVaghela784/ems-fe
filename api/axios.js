import axios from 'axios'
import { setupCache } from 'axios-cache-adapter'
import { deleteCookie, getCookies } from 'cookies-next'
import { setCookiesOptions } from '../utils/helper'

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 24 * 60 * 60 * 1000
})

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

const getToken = (name = 'token') => {
  return getCookies(name)
}

const Axios = axios.create({
  baseURL,
  timeout: 80000
})

Axios.interceptors.request.use(
  async config => {
    const tokenObj = getToken('token')
    if (tokenObj.token) config.headers.Authorization = `Bearer ${tokenObj.token}`

    return config
  },
  error => Promise.reject(error)
)

Axios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error && error.response && error.response.status === 401) {
      const options = setCookiesOptions()
      deleteCookie('token', options)
      window.location.reload()
    }

    return Promise.reject(error)
  }
)

export { Axios }
