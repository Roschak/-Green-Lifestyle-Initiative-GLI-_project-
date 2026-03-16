import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5000/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getPendingActions = () => api.get('/actions/pending')
export const getAllActions     = () => api.get('/actions')
export const getMyActions      = () => api.get('/actions/my')
export const reportAction      = (data) => api.post('/actions', data)
export const verifyAction      = (id, data) => api.put(`/actions/${id}/verify`, data)
export const getLeaderboard    = () => api.get('/leaderboard')

export default api