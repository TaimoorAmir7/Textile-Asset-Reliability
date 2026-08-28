import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Activity, BriefcaseBusiness, Camera, ChartNoAxesColumnIncreasing, ChevronLeft, ChevronRight, ClipboardCheck, Compass, Droplets, Factory, FileChartColumn, LayoutDashboard, LibraryBig, Menu, Plus, RotateCcw, Search, Settings2, ShieldAlert, Shirt, SlidersHorizontal, X } from 'lucide-react';
import { assets, alerts, shadeBatches, templates } from '../../domain/data';
import { useDemo } from '../../state/DemoContext';
import { AssistantPanel } from '../assistant/AssistantPanel';
import { LiveClock } from '../ui/LiveClock';
import { NotificationCenter } from '../notifications/NotificationCenter';

const navGroups=[
  {label:'Platform',items:[['/','Operations',LayoutDashboard],['/discover','Discover',Compass],['/templates','Template Library',LibraryBig],['/deploy','Deployments',SlidersHorizontal]]},
  {label:'Operations',items:[['/assets','Asset Explorer',Factory],['/alerts','Alerts',ShieldAlert,'3'],['/cases','Cases & Work Orders',BriefcaseBusiness],['/maintenance','Maintenance Plan',ClipboardCheck]]},
  {label:'Process Intelligence',items:[['/shade','Color Intelligence',Droplets],['/vision','Fabric Inspection',Camera],['/apparel','Apparel Operations',Shirt]]},
  {label:'Analytics',items:[['/optimize','Optimize',ChartNoAxesColumnIncreasing],['/reports','Reports',FileChartColumn]]},
  {label:'Administration',items:[['/configuration','Client Configuration',Settings2],['/audit','Audit Trail',Activity]]},
];

export function AppShell(){
  const [searchOpen,setSearchOpen]=useState(false); const [query,setQuery]=useState(''); const [mobile,setMobile]=useState(false);
  const navigate=useNavigate(); const location=useLocation(); const {resetDemo}=useDemo();
  useEffect(()=>{ window.scrollTo({top:0,behavior:'auto'}); window.requestAnimationFrame(()=>document.querySelector('.sidebar .nav-item.active')?.scrollIntoView({block:'nearest'})); },[location.pathname]);
  const results=query.length<2?[]:[
    ...assets.filter(x=>`${x.id} ${x.name}`.toLowerCase().includes(query.toLowerCase())).map(x=>({type:'AS',title:x.id,meta:`${x.name} • ${x.risk} risk`,to:`/assets/${x.id}`})),
    ...alerts.filter(x=>`${x.id} ${x.title}`.toLowerCase().includes(query.toLowerCase())).map(x=>({type:'AL',title:x.id,meta:`${x.title} • ${x.assetId}`,to:`/alerts/${x.id}`})),
    ...templates.filter(x=>x.name.toLowerCase().includes(query.toLowerCase())).map(x=>({type:'TP',title:x.name,meta:`${x.process} • v${x.version}`,to:`/templates/${x.id}`})),
    ...shadeBatches.filter(x=>x.id.toLowerCase().includes(query.toLowerCase())).map(x=>({type:'ΔE',title:x.id,meta:`${x.colour} • Shade batch`,to:'/shade'})),
  ].slice(0,7);
  const go=to=>{navigate(to);setSearchOpen(false);setQuery('');setMobile(false)};
  return <div className="react-app">
    <aside className={`sidebar ${mobile?'sidebar-open':''}`}>
      <div className="brand"><div className="brandmark"><span/><span/><span/></div><div><b>Spark Technologies</b><small>Textile Intelligence</small></div><button className="close-mobile" onClick={()=>setMobile(false)}><X/></button></div>
      <nav>{navGroups.map(group=><div key={group.label}><p>{group.label}</p>{group.items.map(([to,label,Icon,count])=><NavLink to={to} end={to==='/'} key={to} onClick={()=>setMobile(false)} className={({isActive})=>`nav-item ${isActive?'active':''}`}><Icon/><span>{label}</span>{count&&<em>{count}</em>}</NavLink>)}</div>)}</nav>
      <div className="side-foot"><button onClick={resetDemo}><RotateCcw/><span>Restore operating state</span></button><div className="profile"><div className="avatar">AK</div><div><b>Amna Khan</b><small>Reliability Engineer</small></div><span>•••</span></div></div>
    </aside>
    <main>
      <header className="topbar"><div className="history-actions"><button onClick={()=>navigate(-1)} aria-label="Back"><ChevronLeft/></button><button onClick={()=>navigate(1)} aria-label="Forward"><ChevronRight/></button></div><button className="mobile-menu" onClick={()=>setMobile(true)}><Menu/></button><button className="search" onClick={()=>setSearchOpen(true)}><Search/><span>Search assets, alerts, batches...</span><kbd>⌘ K</kbd></button><div className="top-actions"><LiveClock/><button className="plant"><span className="plant-dot"/>Plant A⌄</button><NotificationCenter/><button className="primary small" onClick={()=>go('/cases')}><Plus/> Create case</button></div></header>
      <div className="route-transition" key={location.pathname}><Outlet /></div>
    </main>
    {searchOpen&&<div className="modal-back" onMouseDown={()=>setSearchOpen(false)}><div className="search-modal" onMouseDown={e=>e.stopPropagation()}><div><Search/><input autoFocus placeholder="Search assets, alerts, batches, templates..." value={query} onChange={e=>setQuery(e.target.value)} /><kbd>ESC</kbd></div><p>{query.length<2?'QUICK ACCESS':'SEARCH RESULTS'}</p>{query.length<2?<><button onClick={()=>go('/assets/AJ-003')}><span className="search-type">AS</span><span><b>AJ-003</b><small>Air-Jet Loom • High risk</small></span></button><button onClick={()=>go('/alerts/ALR-001')}><span className="search-type alert">AL</span><span><b>ALR-001</b><small>Multi-signal deviation</small></span></button></>:results.length?results.map(r=><button key={`${r.type}-${r.title}`} onClick={()=>go(r.to)}><span className="search-type">{r.type}</span><span><b>{r.title}</b><small>{r.meta}</small></span></button>):<div className="search-empty"><Activity/><span>No matching entities</span></div>}</div></div>}
    <AssistantPanel />
  </div>;
}
