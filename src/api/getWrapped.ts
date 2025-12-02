// import api from '../api'
import { WrappedStats } from '../typings'

export const getWrapped = async (): Promise<WrappedStats> => {
  // TODO: Replace with real API call when endpoint is ready
  // const { data } = await api.get<WrappedStats>('wrapped')
  // return data

  // Mock data from example response
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate loading
  const mockData: WrappedStats = {
    user_total: 14,
    user_created: 4,
    user_images: 10,
    user_edits: 0,
    activity_percentage: 0.23134328358208955,
    year: '2025',
  }
  return mockData
}
