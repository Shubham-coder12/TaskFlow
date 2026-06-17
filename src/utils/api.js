import axios from 'axios'
const api = axios.create({ baseURL: '' })
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers['X-Auth-Token'] = t
  return cfg
})
export default api
