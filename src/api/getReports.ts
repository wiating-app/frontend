import api from '../api'
import { Location } from '../typings'
import serializeData from '../utils/serializeData'

// Raw API response type (internal use only)
interface SearchPointsResponse {
  points: any[]
}

export const getReports = async (): Promise<Location[]> => {
  const { data } = await api.post<SearchPointsResponse>('search_points', {
    report_reason: true,
  })
  return data.points.map(item => serializeData(item))
}
