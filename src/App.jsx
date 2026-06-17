import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Background3D from './components/Background3D'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#9AA3C2'}}>Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}
function Public({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}
function Inner() {
  const { user } = useAuth()
  return (
    <>
      <Background3D />
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Public><Login /></Public>} />
        <Route path="/register" element={<Public><Register /></Public>} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      </Routes>
    </>
  )
}
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Inner />
        <Toaster position="top-right" toastOptions={{ style: { borderRadius: 12, fontFamily: 'Inter,sans-serif', fontSize: 14 } }} />
      </AuthProvider>
    </BrowserRouter>
  )
}
