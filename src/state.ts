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

export const activeLocationState = atom<any | null>({
  key: 'activeLocation',
  default: null,
})

export const markersState = atom<any[]>({
  key: 'markers',
  default: [],
})

export const searchResultsState = atom<any[]>({
  key: 'searchResults',
  default: [],
})

export const logsState = atom<any[]>({
  key: 'logs',
  default: [],
})

export const logDetailsState = atom<any | null>({
  key: 'logDetails',
  default: null,
})
