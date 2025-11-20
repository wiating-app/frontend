import api from '../api'
import serializeData from '../utils/serializeData'
import { Location } from '../typings'

// Raw API response type (internal use only)
interface GetUnpublishedResponse {
  points: any[]
}

export const getUnpublished = async (): Promise<Location[]> => {
  const { data } = await api.get<GetUnpublishedResponse>('get_unpublished', {})
  return data.points.map(item => serializeData(item))
}
