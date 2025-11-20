import api from '../api'

export const reportPoint = async (
  id: string | number,
  reportReason: string
): Promise<void> => {
  await api.post(`report/${id}`, { report_reason: reportReason })
}
