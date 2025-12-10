import api from '../api'
import { Location } from '../typings'
import serializeData from '../utils/serializeData'
import { LocationFormData } from './addPoint'

// Raw API response type (internal use only)
interface ModifyPointResponse {
  [key: string]: any
}

export const modifyPoint = async (id: string | number, data: LocationFormData): Promise<Location> => {
  const { data: response } = await api.put<ModifyPointResponse>(`modify_point/${id}`, data)
  return serializeData(response)
}
