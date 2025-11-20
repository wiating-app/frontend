// Shared data structure types used across the application
// These represent serialized data after serializeData() transformation

export interface Location {
  id: string | number
  name: string
  description?: string
  directions?: string
  type?: string | number
  location: {
    lat: number
    lng: number
  }
  created_timestamp: Date
  last_modified_timestamp: Date
  water_exists?: boolean | null
  water_comment?: string
  fire_exists?: boolean | null
  fire_comment?: string
  is_disabled?: boolean
  unpublished?: boolean
  images?: Image[]
  report_reason?: string | null
  [key: string]: any // Allow additional properties
}

export interface Image {
  name: string
  [key: string]: any
}

export interface Log {
  _id: string
  _source: LogSource
  [key: string]: any
}

export interface LogSource {
  doc_id: string | number
  modified_by: string
  name?: string
  timestamp?: string | number
  changes?: {
    [fieldName: string]: {
      old_value?: any
      new_value?: any
    } | {
      old_value?: any
      new_value?: string
    }
  } & {
    images?: {
      old_value?: any
      new_value?: string
    }
    action?: string
  }
  reviewed_at?: string | null
  [key: string]: any
}

export interface LogDetails {
  _id: string
  _source: LogSource
}

export interface Report {
  id: string | number
  report_reason: string
  [key: string]: any
}

export interface LocationType {
  id: string | number
  label: {
    [language: string]: string
  }
  iconId: string
  icon?: string
  [key: string]: any
}

export interface User {
  name?: string
  picture?: string
  given_name?: string
  family_name?: string
  sub?: string
  [key: string]: any
}

export interface Auth0ContextInterface {
  user?: User
  loading: boolean
  popupOpen: boolean
  loginWithPopup: (options?: any) => Promise<void>
  handleRedirectCallback: () => Promise<any>
  loginWithRedirect: (options?: any) => Promise<void>
  getTokenSilently: (options?: any) => Promise<string | undefined>
  getTokenWithPopup: (options?: any) => Promise<string | undefined>
  logout: (options?: any) => void
  getIdTokenClaims: (options?: any) => Promise<any | undefined>
  __onUnload: () => void
  isModerator: boolean
  isLoggedIn: boolean
  setStoredPosition: (position: { center?: [number, number]; zoom?: number; bounds?: L.LatLngBoundsExpression }) => void
  getStoredPosition: () => { center?: [number, number]; zoom?: number; bounds?: L.LatLngBoundsExpression } | null
}

export interface Config {
  branding: {
    siteName: string
    themeColor: string
    secondaryColor?: string
    info: string
    adminInfo?: string
    legalInfo?: string
    lightTheme?: boolean
  }
  locationTypes: LocationType[]
  settings: {
    enableReport: boolean
    enableDirectionsField: boolean
    enableFireField: boolean
    enableWaterField: boolean
    enableExport: boolean
    enableVerification: boolean
    showVersionInfo: boolean
  }
  faq?: { q: string; a: string }[]
  termsAndConditions?: string
  privacyPolicy?: string
  translations?: {
    [language: string]: {
      [key: string]: any
    }
  }
}
