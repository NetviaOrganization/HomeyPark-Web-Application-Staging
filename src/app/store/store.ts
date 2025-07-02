// store.ts
import { Nullable } from 'primereact/ts-helpers'
import { createStore, useStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { Profile } from '../features/profile/model/profile'

/* ----------  state & actions ---------- */
interface StoreState {
  auth: {
    token: Nullable<string>
    userId: Nullable<string>
    email: Nullable<string>
    profileId: Nullable<string>
  }
  profileData: { loading: boolean; profile: Nullable<Profile> }
}

/* ----------  explicit mutators list ----------
   Order **must** match the outer-to-inner wrapping:
   persist(immer(...))  →  ['zustand/persist', unknown], ['zustand/immer', never]
------------------------------------------------- */
type Mutators = [['zustand/persist', unknown], ['zustand/immer', never]]

/* ----------  vanilla store ---------- */
export const appStore = createStore<StoreState, Mutators>(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    immer<StoreState>((_set) => ({
      auth: { token: null, userId: null, email: null, profileId: null },
      profileData: { loading: false, profile: null },
    })),
    {
      name: 'auth-storage',
      partialize: (s) => ({ auth: s.auth }), // only `auth` is persisted
    }
  )
)

/* ----------  hooks ---------- */
export const useAppStore = <T>(selector: (state: StoreState) => T) => {
  const state = useStore(appStore, selector)

  return state
}
