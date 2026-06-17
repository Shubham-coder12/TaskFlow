import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
const Logo=()=>(
  <div style={{width:52,height:52,borderRadius:16,background:'var(--blue)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 4px 16px rgba(79,142,247,0.35)'}}>
    <svg width="24" height="24" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1.5" fill="white"/><rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity="0.6"/><rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity="0.6"/><rect x="9" y="9" width="5" height="5" rx="1.5" fill="white"/></svg>
  </div>
)
export default function Register() {
  const [name,setName]=useState('')
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const {register}=useAuth(); const nav=useNavigate()
  const handle=async()=>{
    if(!username||!password)return toast.error('Fill all fields')
    if(password.length<6)return toast.error('Min 6 characters')
    setLoading(true)
    try{await register(username,password,name||username);toast.success('Account created!');nav('/dashboard')}
    catch(e){toast.error(e.response?.data?.error||'Registration failed')}
    finally{setLoading(false)}
  }
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20,position:'relative',zIndex:1}}>
      <div style={{width:'100%',maxWidth:400,background:'rgba(255,255,255,0.88)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',border:'1px solid rgba(255,255,255,0.95)',borderRadius:24,padding:'40px 36px',boxShadow:'0 8px 40px rgba(79,142,247,0.12)'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <Logo/>
          <h1 style={{fontSize:22,fontWeight:700,color:'var(--text-primary)',letterSpacing:'-0.4px'}}>Create account</h1>
          <p style={{fontSize:14,color:'var(--text-secondary)',marginTop:6}}>Get started with TaskFlow</p>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="form-group"><label className="label">Full Name</label>
            <input className="input" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/>
          </div>
          <div className="form-group"><label className="label">Username *</label>
            <input className="input" placeholder="username123" value={username} onChange={e=>setUsername(e.target.value.toLowerCase().replace(/\s/g,''))}/>
          </div>
          <div className="form-group"><label className="label">Password *</label>
            <input type="password" className="input" placeholder="Min 6 characters" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handle()}/>
          </div>
        </div>
        <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:20,padding:'12px'}} onClick={handle} disabled={loading}>
          {loading?'Creating...':'Create Account'}
        </button>
        <p style={{textAlign:'center',fontSize:13,color:'var(--text-secondary)',marginTop:20}}>
          Already have an account?{' '}<Link to="/login" style={{color:'var(--blue)',fontWeight:500,textDecoration:'none'}}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
