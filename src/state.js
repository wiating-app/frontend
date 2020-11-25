import { atom } from 'recoil'

// Global app state.

export const editModeState = atom({
  key: 'editMode',
  default: false,
})

export const isLocationTabOpenState = atom({
  key: 'isLocationTabOpen',
  default: false,
})

export const activeTypesState = atom({
  key: 'activeTypes',
  default: [],
})

export const cachedLocationState = atom({
  key: 'cachedLocation',
  default: null,
})

export const searchResultsState = atom({
  key: 'searchResults',
  default: [],
})

export const cachedLogDetailsState = atom({
  key: 'cachedLogDetails',
  default: null,
})
