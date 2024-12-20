import { create } from 'zustand'

interface SettingsStore {
  speedThreshold: number
  setSpeedThreshold: (threshold: number) => void
  isCallBlockingEnabled: boolean
  toggleCallBlocking: () => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  speedThreshold: 20,
  setSpeedThreshold: (threshold) => set({ speedThreshold: threshold }),
  isCallBlockingEnabled: true,
  toggleCallBlocking: () => set((state) => ({ isCallBlockingEnabled: !state.isCallBlockingEnabled })),
}))

