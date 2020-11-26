import { atom } from 'recoil'

// Global app state.

export const editModeState = atom({
  key: 'editMode',
  default: false,
})

export const isDrawerOpenState = atom({
  key: 'isDrawerOpen',
  default: false,
})

export const activeTypesState = atom({
  key: 'activeTypes',
  default: [],
})

export const activeLocationState = atom({
  key: 'activeLocation',
  default: null,
})

export const markersState = atom({
  key: 'markers',
  default: [],
})

export const searchResultsState = atom({
  key: 'searchResults',
  default: [],
})

export const cachedLogDetailsState = atom({
  key: 'cachedLogDetails',
  default: null,
})
