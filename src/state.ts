import { Location } from './typings'
import { atom } from 'recoil'

// Global app state.

export const editModeState = atom<boolean>({
  key: 'editMode',
  default: false,
})

export const isDrawerOpenState = atom<boolean>({
  key: 'isDrawerOpen',
  default: false,
})

export const activeTypesState = atom<any[]>({
  key: 'activeTypes',
  default: [],
})

export const activeLocationState = atom<Location | null>({
  key: 'activeLocation',
  default: null,
})

export const markersState = atom<Location[]>({
  key: 'markers',
  default: [],
})
