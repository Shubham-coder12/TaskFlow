import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const handleLogout = async () => { await logout(); toast.success('Logged out'); nav('/login') }
  return (
    <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:50,background:'rgba(255,255,255,0.80)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',borderBottom:'1px solid rgba(226,232,248,0.8)',padding:'0 24px',height:'60px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:32,height:32,borderRadius:10,background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 8px rgba(79,142,247,0.35)'}}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1.5" fill="white"/><rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.6"/><rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.6"/><rect x="9" y="9" width="5" height="5" rx="1.5" fill="white"/></svg>
        </div>
        <span style={{fontWeight:700,fontSize:17,color:'var(--text-primary)',letterSpacing:'-0.3px'}}>TaskFlow</span>
      </div>
      {user && (
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 12px',borderRadius:99,background:'var(--blue-light)',color:'var(--blue)',fontSize:13,fontWeight:500}}>
            <div style={{width:24,height:24,borderRadius:'50%',background:'var(--blue)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700}}>
              {(user.name||user.username||'U')[0].toUpperCase()}
            </div>
            {user.name||user.username}
          </div>
          <button className="btn btn-ghost" style={{padding:'6px 14px',fontSize:13}} onClick={handleLogout}>Sign out</button>
        </div>
      )}
    </nav>
  )
}
