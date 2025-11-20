import api from '../api'
import { Log, LogSource } from '../typings'

// Raw API response type (internal use only)
interface LogReviewedResponse {
  [key: string]: any
}

export const logReviewed = async (id: string): Promise<Log> => {
  const { data } = await api.post<LogReviewedResponse>(`log_reviewed/${id}`)
  return { _id: id, _source: data as LogSource }
}

