import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
const C = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = localStorage.getItem('token')
    if (t) api.get('/api/me').then(r => setUser(r.data)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false))
    else setLoading(false)
  }, [])
  const login = async (username, password) => {
    const r = await api.post('/api/login', { username, password })
    localStorage.setItem('token', r.data.token); setUser(r.data.user); return r.data
  }
  const register = async (username, password, name) => {
    const r = await api.post('/api/register', { username, password, name })
    localStorage.setItem('token', r.data.token); setUser(r.data.user); return r.data
  }
  const logout = async () => {
    try { await api.post('/api/logout') } catch {}
    localStorage.removeItem('token'); setUser(null)
  }
  return <C.Provider value={{ user, loading, login, register, logout }}>{children}</C.Provider>
}
export const useAuth = () => useContext(C)
