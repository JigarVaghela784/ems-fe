import { create } from 'zustand'

export const useLeavesStore = create(set => ({
  leaves: { loading: true },
  setLeaves: (leaves = {}) => {
    set(state => ({ leaves }))
  }
}))
