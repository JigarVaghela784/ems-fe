import { create } from 'zustand'

export const useProjectStore = create(set => ({
  projectList: [],
  setProjectList: (projectList = []) => {
    set(state => ({ projectList }))
  },
  project: {},
  setProject: (project = {}) => {
    set(state => ({ project }))
  }
}))
