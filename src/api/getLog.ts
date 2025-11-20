import api from '../api'
import { LogDetails, LogSource } from '../typings'

// Raw API response type (internal use only)
interface GetLogResponse {
  [key: string]: any
}

export const getLog = async (id: string): Promise<LogDetails> => {
  const { data } = await api.get<GetLogResponse>(`get_log/${id}`)
  return { _id: id, _source: data as LogSource }
}
