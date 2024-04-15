import { create } from 'zustand'

export const useUserStore = create(set => ({
  data: { loading: true },
  user: { loading: true },
  allUser: [],
  setUser: (user = {}) => {
    set(state => ({ user }))
  },
  setAllUser: (allUser = []) => {
    set(state => ({ allUser }))
  },
  pagination: [],
  setPagination: (pagination = []) => {
    set(state => ({ pagination }))
  },
  events: [],
  setEvents: (events = []) => {
    set(state => ({ events }))
  }
}))
