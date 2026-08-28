import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, FileSearch, FlaskConical, ShieldAlert, TrendingUp } from 'lucide-react';
import { alerts } from '../domain/data';
import { useDemo } from '../state/DemoContext';
import { MetricCard } from '../components/ui/MetricCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MachineReference } from '../components/ui/MachineReference';
import { PageHeader } from '../components/ui/PageHeader';
import { OperationsTrend } from '../components/charts/OperationsTrend';
import { LiveEventRail } from '../components/operations/LiveEventRail';
import { ProcessFlow } from '../components/operations/ProcessFlow';

export function OverviewPage(){
  const navigate=useNavigate(); const {assets,scenario,setScenario}=useDemo();
  const risky=assets.filter(x=>['High','Critical','Medium'].includes(x.risk));
  return <div className="page">
    <PageHeader eyebrow={<><span className="live-dot"/> PLANT A • LIVE OPERATIONS</>} title="Textile operations overview" subtitle="Reliability health across Plant A — Friday, 21 August" actions={<><select value={scenario} onChange={e=>setScenario(e.target.value)}><option value="normal">Normal operations</option><option value="loom">Loom degradation profile</option><option value="compressor">Critical compressor profile</option><option value="shade">Shade deviation profile</option></select><button className="secondary" onClick={()=>navigate('/assets')}>View assets</button></>} />
    <section className="kpis motion-refresh" key={`kpis-${scenario}`}>
      <MetricCard label="Total assets" value="128" meta="+6 this month" onClick={()=>navigate('/assets')}/><MetricCard label="Healthy assets" value="104" meta="81.3% of fleet" tone="good" onClick={()=>navigate('/assets')}/><MetricCard label="Assets at risk" value={risky.length+4} meta="2 need attention" tone="warn" onClick={()=>navigate('/assets')}/><MetricCard label="Active alerts" value="12" meta="3 high priority" tone="bad" onClick={()=>navigate('/alerts')}/><MetricCard label="Open work orders" value="7" meta="2 due today" onClick={()=>navigate('/cases')}/>
    </section>
    <section className="realtime-grid"><OperationsTrend/><LiveEventRail/></section>
    <ProcessFlow/>
    <section className="dashboard-grid motion-refresh" key={`dashboard-${scenario}`}>
      <article className="card health-card"><div className="card-head"><div><h2>Fleet health</h2><p>Asset health distribution</p></div><button>Last 24 hours⌄</button></div><div className="health-body"><div className="donut"><div><strong>84</strong><span>Reliability<br/>score</span></div></div><div className="health-legend">{[['green','Healthy','104','81.3%'],['blue','Monitoring','16','12.5%'],['amber','Warning','6','4.7%'],['red','Critical','2','1.5%']].map(x=><div key={x[1]}><span className={`dot ${x[0]}`}/><b>{x[1]}</b><strong>{x[2]}</strong><small>{x[3]}</small></div>)}</div></div></article>
      <article className="card risk-card"><div className="card-head"><div><h2>Top risk assets</h2><p>Ranked by reliability risk</p></div><button onClick={()=>navigate('/assets')}>View all →</button></div>{assets.slice().sort((a,b)=>a.health-b.health).slice(0,4).map(a=><button className="asset-row" key={a.id} onClick={()=>navigate(`/assets/${a.id}`)}><span className="mini-img"><img src={a.image}/></span><span className="asset-name"><b>{a.id}</b><small>{a.name}</small></span><span className="mini-health"><i style={{width:`${a.health}%`}}/></span><strong>{a.health}%</strong><StatusBadge tone={a.risk}>{a.risk}</StatusBadge><ArrowRight/></button>)}</article>
      <article className="card focus-card"><div className="focus-copy"><div className="eyebrow orange">PRIMARY INVESTIGATION</div><div className="focus-title"><div><h2>AJ-003</h2><p>Air-Jet Loom • Weaving Shed A</p></div><StatusBadge tone="High">High risk</StatusBadge></div><div className="health-inline"><span>Health score</span><b>62%</b><div><i style={{width:'62%'}}/></div></div><p className="insight"><TrendingUp/><b>Multi-signal deviation detected.</b> Vibration, temperature and miss-pick frequency are above the asset’s recent baseline.</p><button className="primary" onClick={()=>navigate('/alerts/ALR-001')}>Open investigation <ArrowRight/></button></div><MachineReference src="/assets/air-jet-loom.png" alt="Labeled air-jet loom anatomy" className="focus-image" /></article>
      <article className="card activity-card"><div className="card-head"><div><h2>Recent activity</h2><p>Workflow events across Plant A</p></div><button>View audit log →</button></div><div className="activity">{[[ShieldAlert,'alert','High-risk alert generated','AJ-003 • Multi-signal deviation','10:20'],[FileSearch,'case','Case CASE-018 opened','Assigned to Amna Khan','10:22'],[FlaskConical,'shade','Shade batch failed rule','BATCH-003 • ΔE 1.34','09:48'],[Check,'work','Inspection completed','STN-001 • Zone 4 fan','08:35']].map(([Icon,tone,title,meta,time])=><div key={title}><i className={`event ${tone}`}><Icon/></i><p><b>{title}</b><span>{meta}</span></p><time>{time}</time></div>)}</div></article>
    </section>
  </div>;
}
