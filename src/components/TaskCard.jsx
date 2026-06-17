import { Pencil, Trash2, Calendar } from 'lucide-react'
const SL={todo:'To Do',in_progress:'In Progress',done:'Done'}
const PL={low:'Low',medium:'Medium',high:'High'}
export default function TaskCard({task,onEdit,onDelete,onStatusChange}) {
  const fmt=d=>d?new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric'}):null
  return (
    <div style={{background:'rgba(255,255,255,0.85)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid var(--border-light)',borderRadius:'var(--radius)',padding:'18px 20px',boxShadow:'var(--shadow-sm)',transition:'box-shadow 0.18s,transform 0.18s'}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-md)';e.currentTarget.style.transform='translateY(-2px)'}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-sm)';e.currentTarget.style.transform='translateY(0)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,marginBottom:10}}>
        <h3 style={{fontSize:15,fontWeight:600,color:'var(--text-primary)',lineHeight:1.4,textDecoration:task.status==='done'?'line-through':'none',opacity:task.status==='done'?0.5:1}}>{task.title}</h3>
        <div style={{display:'flex',gap:4,flexShrink:0}}>
          {[['edit',<Pencil size={14}/>,()=>onEdit(task),'var(--blue)','var(--blue-light)'],['del',<Trash2 size={14}/>,()=>onDelete(task.id),'var(--red)','var(--red-light)']].map(([k,icon,fn,hc,hbg])=>(
            <button key={k} onClick={fn} style={{background:'none',border:'none',cursor:'pointer',padding:'4px',borderRadius:6,color:'var(--text-muted)',transition:'all 0.15s',display:'flex',alignItems:'center'}}
              onMouseEnter={e=>{e.currentTarget.style.color=hc;e.currentTarget.style.background=hbg}}
              onMouseLeave={e=>{e.currentTarget.style.color='var(--text-muted)';e.currentTarget.style.background='none'}}>
              {icon}
            </button>
          ))}
        </div>
      </div>
      {task.description&&<p style={{fontSize:13,color:'var(--text-secondary)',marginBottom:12,lineHeight:1.5}}>{task.description}</p>}
      <div style={{display:'flex',flexWrap:'wrap',gap:6,alignItems:'center'}}>
        <span className={`badge badge-${task.status}`}>{SL[task.status]}</span>
        <span className={`badge badge-${task.priority}`}>{PL[task.priority]}</span>
        {task.due_date&&<span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:12,color:'var(--text-muted)'}}><Calendar size={11}/>{fmt(task.due_date)}</span>}
      </div>
      <div style={{marginTop:14,paddingTop:12,borderTop:'1px solid var(--border-light)'}}>
        <select value={task.status} onChange={e=>onStatusChange(task.id,e.target.value)} className="input" style={{padding:'6px 10px',fontSize:12,cursor:'pointer'}}>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  )
}
