import api from '../api'
import { Log } from '../typings'

/* eslint-disable camelcase */

// Raw API response type (internal use only)
interface GetLogsResponse {
  logs: any[]
  total: number
}

export interface LogParams {
  page: number
  size: number
  id?: string
  reviewed_at?: boolean
}

export const getLogs = async (params: LogParams): Promise<{ logs: Log[]; total: number }> => {
  const { page, size, id, reviewed_at } = params
  const { data } = await api.get<GetLogsResponse>(`get_logs${id ? `/${id}` : ''}`, {
    params: {
      size,
      offset: size * page,
      reviewed_at,
    } as any,
  })
  return {
    logs: data.logs as Log[],
    total: data.total,
  }
}

