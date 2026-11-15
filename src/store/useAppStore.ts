import { create } from 'zustand'

type Submission = {
  id: string
  name: string
  email: string
  message: string
  createdAt: Date
}

type AppStore = {
  submissions: Submission[]
  addSubmission: (submission: Omit<Submission, 'id' | 'createdAt'>) => void
  clearSubmissions: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  submissions: [],
  addSubmission: (data) =>
    set((state) => ({
      submissions: [
        ...state.submissions,
        { ...data, id: crypto.randomUUID(), createdAt: new Date() },
      ],
    })),
  clearSubmissions: () => set({ submissions: [] }),
}))
