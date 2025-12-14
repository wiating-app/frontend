import api from '../api'
import { Location } from '../typings'
import serializeData from '../utils/serializeData'

// Raw API response type (internal use only)
interface GetUnpublishedResponse {
  points: any[]
}

export const getUnpublished = async (): Promise<Location[]> => {
  const { data } = await api.get<GetUnpublishedResponse>('get_unpublished', {})
  return data.points.map(item => serializeData(item))
}
