import { create } from 'zustand'

export const useAttendanceStore = create(set => ({
  attendanceLoading: true,
  setAttendanceLoading: attendanceLoading => {
    set(state => ({ ...state, attendanceLoading }))
  },
  attendanceList: [],
  setAttendanceList: (attendanceList = []) => {
    set(state => ({ ...state, attendanceList }))
  },
  attendance: {},
  setAttendance: attendance => {
    set(state => ({ ...state, attendance }))
  },
  allDataLoading: true,
  setAllDataLoading: allDataLoading => {
    set(state => ({ ...state, allDataLoading }))
  },
  allUserAttendance: [],
  setAllUserAttendance: allUserAttendance => {
    set(state => ({ ...state, allUserAttendance }))
  },
  attendanceHoliday: [],
  setAttendanceHoliday: attendanceHoliday => {
    set(state => ({ ...state, attendanceHoliday }))
  },
  leave: [],
  setLeave: leave => {
    set(state => ({ ...state, leave }))
  }
}))
