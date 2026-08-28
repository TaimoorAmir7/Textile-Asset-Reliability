import { useMemo, useRef, useState } from 'react';
import { Bell, BellRing, Check, CheckCheck, ChevronRight, CircleAlert, FlaskConical, Rocket, Wrench, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const seedNotifications=[
  {id:'NTF-001',category:'Reliability',title:'High-risk alert generated',detail:'AJ-003 • Multi-signal operating deviation',time:'2 min ago',tone:'High',to:'/alerts/ALR-001',icon:CircleAlert,unread:true},
  {id:'NTF-002',category:'Maintenance',title:'Work order assigned',detail:'WO-031 • Maintenance Team A',time:'8 min ago',tone:'Medium',to:'/cases',icon:Wrench,unread:true},
  {id:'NTF-003',category:'Quality',title:'Shade deviation detected',detail:'BATCH-003 • ΔE 1.34 exceeds configured 1.00',time:'19 min ago',tone:'Critical',to:'/shade',icon:FlaskConical,unread:true},
  {id:'NTF-004',category:'Deployment',title:'Template deployment completed',detail:'Air-Jet Loom Reliability • 8 assets',time:'1 hr ago',tone:'Low',to:'/deploy',icon:Rocket,unread:false},
  {id:'NTF-005',category:'Reliability',title:'Asset returned to healthy',detail:'STN-001 • Verification complete',time:'3 hrs ago',tone:'Low',to:'/assets/STN-001',icon:Check,unread:false},
];

export function NotificationCenter(){
  const [open,setOpen]=useState(false),[filter,setFilter]=useState('All'),[items,setItems]=useState(seedNotifications);const navigate=useNavigate();const buttonRef=useRef(null);
  const unread=items.filter(item=>item.unread).length;
  const shown=useMemo(()=>filter==='All'?items:filter==='Unread'?items.filter(item=>item.unread):items.filter(item=>item.category===filter),[filter,items]);
  const openItem=item=>{setItems(current=>current.map(value=>value.id===item.id?{...value,unread:false}:value));setOpen(false);navigate(item.to)};
  return <div className="notification-center"><button ref={buttonRef} className={`icon-btn ${open?'active':''}`} aria-label="Notifications" aria-expanded={open} onClick={()=>setOpen(!open)}><Bell/>{unread>0&&<b>{unread}</b>}</button>{open&&<><button className="notification-scrim" aria-label="Close notifications" onClick={()=>setOpen(false)}/><aside className="notification-panel"><header><div><span><BellRing/></span><div><h2>Notifications</h2><p>{unread} unread • Plant A</p></div></div><button onClick={()=>setOpen(false)} aria-label="Close"><X/></button></header><div className="notification-toolbar"><div>{['All','Unread','Reliability','Quality'].map(value=><button className={filter===value?'active':''} onClick={()=>setFilter(value)} key={value}>{value}{value==='Unread'&&unread>0?<b>{unread}</b>:null}</button>)}</div><button onClick={()=>setItems(current=>current.map(item=>({...item,unread:false})))}><CheckCheck/> Mark all read</button></div><div className="notification-list">{shown.length?shown.map(item=>{const Icon=item.icon;return <button className={item.unread?'unread':''} key={item.id} onClick={()=>openItem(item)}><span className={`notification-icon ${item.tone.toLowerCase()}`}><Icon/></span><span><span><b>{item.category}</b><time>{item.time}</time></span><strong>{item.title}</strong><small>{item.detail}</small></span>{item.unread&&<i/>}<ChevronRight/></button>}):<div className="notification-empty"><CheckCheck/><b>You’re all caught up</b><span>No notifications match this filter.</span></div>}</div><footer><button onClick={()=>{setOpen(false);navigate('/audit')}}>View notification history</button><span>Live event feed <i/></span></footer></aside></>}</div>;
}
