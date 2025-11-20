import api from '../api'
import { Log } from '../typings'

// Raw API response type (internal use only)
interface GetUserLogsResponse {
  logs: any[]
  total: number
}

export interface GetUserLogsParams {
  size: number
  offset: number
}

export const getUserLogs = async (params: GetUserLogsParams): Promise<{ logs: Log[]; total: number }> => {
  const { data } = await api.get<GetUserLogsResponse>('get_user_logs', {
    params: {
      size: params.size,
      offset: params.offset,
    } as any,
  })
  return {
    logs: data.logs as Log[],
    total: data.total,
  }
}

