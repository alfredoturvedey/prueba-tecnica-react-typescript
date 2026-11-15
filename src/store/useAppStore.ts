import { create } from 'zustand'

type AppStore = {
  selectedUserId: number | null
  selectUser: (id: number) => void
  clearSelectedUser: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  selectedUserId: null,
  selectUser: (id) => set({ selectedUserId: id }),
  clearSelectedUser: () => set({ selectedUserId: null }),
}))
