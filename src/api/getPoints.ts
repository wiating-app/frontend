import { AxiosRequestConfig } from 'axios'
import api from '../api'
import { Location } from '../typings'
import serializeData from '../utils/serializeData'

// Raw API response type (internal use only)
interface GetPointsResponse {
  points: any[]
}

export interface Bounds {
  top_right: {
    lat: number
    lon: number
  }
  bottom_left: {
    lat: number
    lon: number
  }
}

export const getPoints = async (bounds: Bounds, config?: AxiosRequestConfig): Promise<Location[]> => {
  const { data } = await api.post<GetPointsResponse>(
    'get_points',
    {
      ...bounds,
      // eslint-disable-next-line camelcase
      // Always send point_type as empty array to get all points
      point_type: [],
    },
    config,
  )
  return data.points.map(item => serializeData(item))
}
