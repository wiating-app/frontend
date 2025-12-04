import api from '../api'
import { WrappedStats } from '../typings'

export const getWrapped = async (): Promise<WrappedStats> => {
  const { data } = await api.get<WrappedStats>('wrapped')
  return data
}
