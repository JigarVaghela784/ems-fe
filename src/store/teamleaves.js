import { create } from 'zustand'

export const useTeamLeaves = create(set => ({
  teamLeaves: [],
  setTeamLeaves: (teamLeaves = []) => {
    set(state => ({ teamLeaves }))
  }
}))
