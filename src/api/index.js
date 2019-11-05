import axios from 'axios'


const authorization = () => {
  const user = localStorage.getItem('currentUser')
  return user
    ? { 'Authorization': `Bearer ${JSON.parse(user).token}` }
    : { 'Authorization': 'd' }
}

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/wiating/`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    ...authorization(),
  },
})

export default api
