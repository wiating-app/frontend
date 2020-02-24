import axios from 'axios'

export const CancelToken = axios.CancelToken
export const isCancel = axios.isCancel

const authorization = () => {
  const user = localStorage.getItem('currentUser')
  return user
    ? { 'Authorization': `Bearer ${JSON.parse(user).token}` }
    : {}
}

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/wiating/`,
  timeout: 10000,
  headers: {
    'Accept-Version': 1,
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
    ...authorization(),
  },
})

export default api
