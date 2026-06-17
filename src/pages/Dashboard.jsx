import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, LayoutGrid, List, CheckCircle2, Clock, CircleDot, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
const FILTERS=[{key:'all',label:'All'},{key:'todo',label:'To Do'},{key:'in_progress',label:'In Progress'},{key:'done',label:'Done'}]
export default function Dashboard() {
  const [tasks,setTasks]=useState([])
  const [stats,setStats]=useState({total:0,todo:0,in_progress:0,done:0})
  const [filter,setFilter]=useState('all')
  const [search,setSearch]=useState('')
  const [modalOpen,setModalOpen]=useState(false)
  const [editTask,setEditTask]=useState(null)
  const [loading,setLoading]=useState(true)
  const [view,setView]=useState('grid')
  const load=useCallback(async()=>{
    try{
      const [tr,sr]=await Promise.all([api.get(`/api/tasks?status=${filter}`),api.get('/api/tasks/stats')])
      setTasks(tr.data);setStats(sr.data)
    }catch{toast.error('Failed to load')}
    finally{setLoading(false)}
  },[filter])
  useEffect(()=>{load()},[load])
  const handleCreate=async(form)=>{
    try{await api.post('/api/tasks',form);toast.success('Task created!');setModalOpen(false);load()}
    catch(e){toast.error(e.response?.data?.error||'Failed')}
  }
  const handleEdit=async(form)=>{
    try{await api.put(`/api/tasks/${editTask.id}`,form);toast.success('Updated!');setEditTask(null);load()}
    catch{toast.error('Failed to update')}
  }
  const handleDelete=async(id)=>{
    if(!confirm('Delete this task?'))return
    try{await api.delete(`/api/tasks/${id}`);toast.success('Deleted');load()}
    catch{toast.error('Failed')}
  }
  const handleStatus=async(id,status)=>{
    try{await api.put(`/api/tasks/${id}`,{status});load()}catch{toast.error('Failed')}
  }
  const filtered=tasks.filter(t=>t.title.toLowerCase().includes(search.toLowerCase())||(t.description||'').toLowerCase().includes(search.toLowerCase()))
  const sc=[
    {label:'Total',value:stats.total,icon:<LayoutGrid size={18}/>,color:'var(--blue)',bg:'var(--blue-light)'},
    {label:'To Do',value:stats.todo,icon:<CircleDot size={18}/>,color:'#9AA3C2',bg:'var(--bg)'},
    {label:'In Progress',value:stats.in_progress,icon:<Clock size={18}/>,color:'#B45309',bg:'var(--orange-light)'},
    {label:'Done',value:stats.done,icon:<CheckCircle2 size={18}/>,color:'#166534',bg:'var(--green-light)'},
  ]
  return (
    <div style={{minHeight:'100vh',paddingTop:80,position:'relative',zIndex:1}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'24px 20px'}}>
        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:14,marginBottom:28}}>
          {sc.map(s=>(
            <div key={s.label} style={{background:'rgba(255,255,255,0.85)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid var(--border-light)',borderRadius:'var(--radius)',padding:'18px 20px',boxShadow:'var(--shadow-sm)',display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:40,height:40,borderRadius:12,background:s.bg,color:s.color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{s.icon}</div>
              <div>
                <div style={{fontSize:24,fontWeight:700,color:'var(--text-primary)',lineHeight:1}}>{s.value}</div>
                <div style={{fontSize:12,color:'var(--text-muted)',marginTop:3}}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Toolbar */}
        <div style={{background:'rgba(255,255,255,0.85)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid var(--border-light)',borderRadius:'var(--radius)',padding:'14px 16px',marginBottom:18,display:'flex',flexWrap:'wrap',gap:12,alignItems:'center'}}>
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
            {FILTERS.map(f=>(
              <button key={f.key} onClick={()=>setFilter(f.key)} style={{padding:'6px 14px',borderRadius:99,fontSize:13,fontWeight:500,border:'none',cursor:'pointer',transition:'all 0.15s',background:filter===f.key?'var(--blue)':'transparent',color:filter===f.key?'#fff':'var(--text-secondary)'}}>
                {f.label}
              </button>
            ))}
          </div>
          <div style={{flex:1}}/>
          <div style={{position:'relative',minWidth:180}}>
            <Search size={14} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}}/>
            <input className="input" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:30,padding:'7px 12px 7px 30px',fontSize:13}}/>
          </div>
          <div style={{display:'flex',gap:4,background:'var(--bg)',borderRadius:8,padding:3}}>
            {[['grid',<LayoutGrid size={14}/>],['list',<List size={14}/>]].map(([v,icon])=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:'5px 8px',borderRadius:6,border:'none',cursor:'pointer',background:view===v?'#fff':'transparent',color:view===v?'var(--blue)':'var(--text-muted)',boxShadow:view===v?'var(--shadow-sm)':'none',display:'flex',alignItems:'center'}}>{icon}</button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={()=>setModalOpen(true)}><Plus size={15}/>New Task</button>
        </div>
        {/* Tasks */}
        {loading?(
          <div style={{textAlign:'center',padding:'60px 0',color:'var(--text-muted)'}}>Loading...</div>
        ):filtered.length===0?(
          <div style={{textAlign:'center',padding:'60px 20px',background:'rgba(255,255,255,0.7)',backdropFilter:'blur(16px)',borderRadius:'var(--radius-lg)',border:'1px dashed var(--border)'}}>
            <AlertCircle size={36} style={{color:'var(--text-muted)',margin:'0 auto 12px'}}/>
            <p style={{color:'var(--text-secondary)',fontWeight:500}}>{search?'No tasks match':'No tasks yet'}</p>
            {!search&&<button className="btn btn-primary" style={{marginTop:16}} onClick={()=>setModalOpen(true)}><Plus size={14}/>Create first task</button>}
          </div>
        ):(
          <div style={{display:view==='grid'?'grid':'flex',flexDirection:view==='list'?'column':undefined,gridTemplateColumns:view==='grid'?'repeat(auto-fill,minmax(290px,1fr))':undefined,gap:14}}>
            {filtered.map(t=><TaskCard key={t.id} task={t} onEdit={setEditTask} onDelete={handleDelete} onStatusChange={handleStatus}/>)}
          </div>
        )}
      </div>
      {modalOpen&&<TaskModal onClose={()=>setModalOpen(false)} onSave={handleCreate}/>}
      {editTask&&<TaskModal task={editTask} onClose={()=>setEditTask(null)} onSave={handleEdit}/>}
    </div>
  )
}
