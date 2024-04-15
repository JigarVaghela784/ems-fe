import { create } from 'zustand'

export const useHolidaysStore = create(set => ({
  holidays: { loading: true },
  upcomingHoliday: [],
  upcomingHolidayLoading: false,
  setHolidays: (holidays = {}) => {
    set(state => ({ holidays }))
  },
  setUpcomingHoliday: (upcomingHoliday = []) => {
    set(state => ({ upcomingHoliday }))
  },
  setUpcomingHolidayLoading: (upcomingHolidayLoading = []) => {
    set(state => ({ upcomingHolidayLoading }))
  }
}))
