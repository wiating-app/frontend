import api from '../api'
import { Location } from '../typings'
import serializeData from '../utils/serializeData'

// Raw API response type (internal use only)
interface AddImageResponse {
  [key: string]: any
}

export const addImage = async (locationId: string | number, file: File): Promise<Location> => {
  const fileObject = new FormData()
  fileObject.append('file', file)
  const { data } = await api.post<AddImageResponse>(`add_image/${locationId}`, fileObject)
  return serializeData(data)
}
