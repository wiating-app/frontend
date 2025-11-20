import api from '../api'
import serializeData from '../utils/serializeData'
import { Location } from '../typings'

// Raw API response type (internal use only)
interface GetPointResponse {
  [key: string]: any
}

export const getPoint = async (id: string): Promise<Location> => {
  const { data } = await api.get<GetPointResponse>(`get_point/${id}`)
  return serializeData(data)
}
