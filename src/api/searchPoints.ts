import api from '../api'
import { Location } from '../typings'
import serializeData from '../utils/serializeData'

// Raw API response type (internal use only)
interface SearchPointsResponse {
  points: any[]
}

export interface SearchParams {
  phrase?: string
  top_right?: {
    lat: number
    lon: number
  }
  bottom_left?: {
    lat: number
    lon: number
  }
  point_type?: number[]
}

export const searchPoints = async (params: SearchParams): Promise<Location[]> => {
  const { data } = await api.post<SearchPointsResponse>('search_points', params)
  return data.points.map(item => serializeData(item))
}
