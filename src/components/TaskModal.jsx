import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
const E={title:'',description:'',status:'todo',priority:'medium',due_date:''}
export default function TaskModal({task,onClose,onSave}) {
  const [form,setForm]=useState(E)
  const [loading,setLoading]=useState(false)
  useEffect(()=>{
    setForm(task?{title:task.title||'',description:task.description||'',status:task.status||'todo',priority:task.priority||'medium',due_date:task.due_date?task.due_date.split('T')[0]:''}:E)
  },[task])
  const set=(k,v)=>setForm(f=>({...f,[k]:v}))
  const handleSave=async()=>{if(!form.title.trim())return;setLoading(true);await onSave(form);setLoading(false)}
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <h2 style={{fontSize:18,fontWeight:700,color:'var(--text-primary)'}}>{task?'Edit Task':'New Task'}</h2>
          <button onClick={onClose} style={{background:'var(--bg)',border:'none',cursor:'pointer',borderRadius:8,padding:6,color:'var(--text-muted)',display:'flex',alignItems:'center'}}><X size={16}/></button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="form-group">
            <label className="label">Title *</label>
            <input className="input" placeholder="What needs to be done?" value={form.title} onChange={e=>set('title',e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSave()} autoFocus/>
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea className="input" placeholder="Add details..." value={form.description} onChange={e=>set('description',e.target.value)}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="form-group">
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e=>set('status',e.target.value)}>
                <option value="todo">To Do</option><option value="in_progress">In Progress</option><option value="done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">Priority</label>
              <select className="input" value={form.priority} onChange={e=>set('priority',e.target.value)}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="label">Due Date</label>
            <input type="date" className="input" value={form.due_date} onChange={e=>set('due_date',e.target.value)}/>
          </div>
        </div>
        <div style={{display:'flex',gap:10,marginTop:24,justifyContent:'flex-end'}}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading||!form.title.trim()}>
            {loading?'Saving...':(task?'Save Changes':'Create Task')}
          </button>
        </div>
      </div>
    </div>
  )
}
