import api from '../api'
import { Location } from '../typings'
import serializeData from '../utils/serializeData'

// Raw API response type (internal use only)
interface AddPointResponse {
  id: string | number
  [key: string]: any
}

export interface LocationFormData {
  name: string
  description?: string
  directions?: string
  type?: string | number
  location: {
    lat: number
    lon: number
  }
  water_exists?: boolean | null
  water_comment?: string
  fire_exists?: boolean | null
  fire_comment?: string
  is_disabled?: boolean
  unpublished?: boolean
}

export const addPoint = async (data: LocationFormData): Promise<Location> => {
  const { data: response } = await api.post<AddPointResponse>('add_point', data)
  return serializeData(response)
}
