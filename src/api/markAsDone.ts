import api from '../api'

export const markAsDone = async (locationId: string | number): Promise<void> => {
  await api.post(`report/${locationId}`, { report_reason: null })
}
