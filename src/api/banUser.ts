import api from '../api'

export const banUser = async (userId: string): Promise<void> => {
  await api.post(`ban_user/${userId}`)
}
