import api from '../api'
import serializeData from '../utils/serializeData'
import { LocationFormData } from './addPoint'
import { Location } from '../typings'

// Raw API response type (internal use only)
interface ModifyPointResponse {
  [key: string]: any
}

export const modifyPoint = async (
  id: string,
  data: LocationFormData
): Promise<Location> => {
  const { data: response } = await api.put<ModifyPointResponse>(`modify_point/${id}`, data)
  return serializeData(response)
}
