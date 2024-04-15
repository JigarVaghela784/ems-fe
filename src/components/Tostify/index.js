import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const notifySuccess = message => {
  toast(`${message}`, {
    type: 'success'
  })
}

export const notifyError = message => {
  toast(`${message}`, {
    type: 'error'
  })
}
