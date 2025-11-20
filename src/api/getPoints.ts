import api from '../api'
import { AxiosRequestConfig } from 'axios'
import serializeData from '../utils/serializeData'
import { Location } from '../typings'

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

export const getPoints = async (
  bounds: Bounds,
  pointTypes?: number[],
  config?: AxiosRequestConfig
): Promise<Location[]> => {
  const { data } = await api.post<GetPointsResponse>('get_points', {
    ...bounds,
    // eslint-disable-next-line camelcase
    ...pointTypes && pointTypes.length ? { point_type: pointTypes } : {},
  }, config)
  return data.points.map(item => serializeData(item))
}

