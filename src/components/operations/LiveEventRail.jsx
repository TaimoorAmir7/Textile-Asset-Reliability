import { ArrowRight, CircleAlert, Clock3, Gauge, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../ui/StatusBadge';

const events=[
  {id:'ALR-001',time:'10:20:14',title:'Multi-signal deviation',asset:'AJ-003 • Air-Jet Loom',tone:'High',icon:CircleAlert,to:'/alerts/ALR-001'},
  {id:'ALR-002',time:'09:42:06',title:'Pressure stability event',asset:'COMP-001 • Utilities',tone:'Critical',icon:Gauge,to:'/alerts/ALR-002'},
  {id:'EVT-041',time:'09:18:31',title:'Maintenance verification',asset:'STN-001 • Finishing',tone:'Low',icon:ShieldCheck,to:'/cases'},
];

export function LiveEventRail(){const navigate=useNavigate();return <aside className="card live-event-rail"><div className="card-head"><div><h2><i className="live-dot"/> Live event stream</h2><p>Reliability and workflow activity</p></div><button>All events →</button></div><div className="event-stream">{events.map((event,index)=>{const Icon=event.icon;return <button key={event.id} style={{animationDelay:`${index*80}ms`}} onClick={()=>navigate(event.to)}><div className={`stream-icon ${event.tone.toLowerCase()}`}><Icon/></div><div><span><b>{event.id}</b><time><Clock3/>{event.time}</time></span><h3>{event.title}</h3><p>{event.asset}</p><footer><StatusBadge tone={event.tone}>{event.tone}</StatusBadge><span>Open detail <ArrowRight/></span></footer></div></button>})}</div><div className="stream-footer"><i/><span>Connected to plant event service</span><b>12 events / shift</b></div></aside>}
