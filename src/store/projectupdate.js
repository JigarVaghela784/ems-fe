import { create } from 'zustand'

export const useProjectUpdateStore = create(set => ({
  projectUpdate: [],
  setProjectUpdate: (projectUpdate = []) => {
    set(state => ({ ...state, projectUpdate }))
  }
}))
