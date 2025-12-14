import api from '../api'

export const deletePoint = async (id: string): Promise<void> => {
  await api.delete(`delete_point/${id}`)
}
