import { useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, CircleAlert, Download, Factory, Search, ShieldCheck, TrendingUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { telemetry, templates } from '../domain/data';
import { calculateAnomalyScore } from '../domain/logic';
import { useDemo } from '../state/DemoContext';
import { PredictionPipeline } from '../components/reliability/PredictionPipeline';
import { MachineReference } from '../components/ui/MachineReference';
import { MiniChart } from '../components/ui/MiniChart';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';

export function AssetExplorerPage(){
  const navigate=useNavigate(),{assets}=useDemo();
  const [query,setQuery]=useState(''),[risk,setRisk]=useState('All');
  const shown=assets.filter(asset=>(risk==='All'||asset.risk===risk)&&`${asset.id} ${asset.name} ${asset.area}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="page"><PageHeader eyebrow="PLANT A • 128 ASSETS" title="Asset explorer" subtitle="Browse equipment by production area and reliability risk." actions={<button className="secondary"><Download/> Export list</button>}/>
    <div className="asset-toolbar card"><label><Search/><input placeholder="Find an asset" value={query} onChange={event=>setQuery(event.target.value)}/></label><div>{['All','Critical','High','Medium','Monitoring','Low'].map(item=><button key={item} className={risk===item?'active':''} onClick={()=>setRisk(item)}>{item}</button>)}</div></div>
    <div className="asset-layout"><aside className="tree card"><h3>Asset hierarchy</h3><label><ChevronDown/> Plant A</label><button className="active"><ChevronDown/> Weaving Shed <em>48</em></button><span>Air-Jet Looms <em>32</em></span><span>Rapier Looms <em>16</em></span>{[['Dye House',18],['Finishing',14],['Utilities',11],['Cut & Sew',37]].map(item=><button key={item[0]}><ChevronRight/>{item[0]} <em>{item[1]}</em></button>)}</aside>
      <section className="asset-table card"><div className="card-head"><div><h2>Deployed assets</h2><p>{shown.length} representative assets • sorted by reliability risk</p></div><button>Last telemetry: now</button></div><div className="table-head"><span>Asset</span><span>Area</span><span>Health</span><span>Risk</span><span>Latest signal</span><span>Status</span></div>{shown.map(asset=><button className="table-row" key={asset.id} onClick={()=>navigate(`/assets/${asset.id}`)}><span className="asset-id"><span className="mini-img"><img src={asset.image}/></span><span><b>{asset.id}</b><small>{asset.name}</small></span></span><span>{asset.area}</span><span><b>{asset.health}%</b><i className="bar"><i style={{width:`${asset.health}%`}}/></i></span><span><StatusBadge tone={asset.risk}>{asset.risk}</StatusBadge></span><span><b>{asset.latest}</b><small>{asset.signal}</small></span><span><StatusBadge tone="Monitoring">{asset.status}</StatusBadge></span></button>)}</section>
    </div>
  </div>;
}

function SignalCard({label,value,unit,delta,tone}){return <div><span>{label}</span><b>{value} <small>{unit}</small></b><em className={tone}>{delta}</em></div>}

export function AssetDetailPage(){
  const {assetId}=useParams(),navigate=useNavigate(),{assets,notify}=useDemo();
  const asset=assets.find(item=>item.id===assetId)||assets[0];
  const template=templates.find(item=>item.id===asset.templateId);
  const data=telemetry[asset.id]||telemetry.default;
  const anomaly=asset.id==='AJ-003'?.81:calculateAnomalyScore(data.vibration);
  const elevated=['High','Critical'].includes(asset.risk);
  return <div className="page"><button className="back" onClick={()=>navigate('/assets')}><ArrowLeft/> Asset explorer</button>
    <div className="asset-hero card"><div className="asset-hero-copy"><div className="eyebrow">{asset.area.toUpperCase()} • CONNECTED ASSET</div><div className="asset-title"><h1>{asset.id}</h1><StatusBadge tone="Monitoring">{asset.status}</StatusBadge><StatusBadge tone={asset.risk}>{asset.risk} risk</StatusBadge></div><p>{asset.name} <span>•</span> {asset.plant} <span>•</span> {asset.owner}</p><div className="hero-health"><div><span>Health score</span><b>{asset.health}<small>/100</small></b></div><div><span>Anomaly score</span><b>{anomaly.toFixed(2)}</b></div><div><span>Active alerts</span><b>{asset.alerts}</b></div><div><span>Runtime</span><b className="date">{asset.runtime}</b></div></div></div><MachineReference src={asset.image} alt={`Labeled ${asset.name} anatomy diagram`} className="asset-diagram" label="Anatomy reference • catalogue"/></div>
    <div className="tabs"><button className="active">Overview</button><button>Telemetry</button><button>Health & Risk</button><button onClick={()=>navigate('/alerts')}>Alerts</button><button>Failure Modes</button><button>Maintenance</button><button>Cases</button></div>
    <PredictionPipeline asset={asset} anomaly={anomaly} elevated={elevated}/>
    <div className="detail-grid"><section className="card telemetry"><div className="card-head"><div><h2>Recent telemetry</h2><p>Live signal history • last 8 hours</p></div><button>8 hours⌄</button></div><div className="telemetry-chart"><div className="y-labels"><span>High</span><span>Baseline</span><span>Low</span></div><MiniChart values={data.vibration} color={elevated?'#e97451':'#117964'} height={190}/><div className="baseline"/></div><div className="signal-cards"><SignalCard label="Vibration RMS" value={data.vibration.at(-1)} unit="mm/s" delta={elevated?'↑ 23%':'Stable'} tone={elevated?'bad':''}/><SignalCard label="Temperature" value={data.temperature.at(-1)} unit="°C" delta={elevated?'↑ 11%':'Stable'} tone={elevated?'bad':''}/><SignalCard label="Machine speed" value={data.speed.at(-1)} unit="ppm" delta="Within range"/><SignalCard label="Miss-picks" value={data.missPicks.at(-1)} unit="/1k" delta={elevated?'↑ 41%':'Stable'} tone={elevated?'bad':''}/></div></section>
      <aside className="card evidence"><div className="card-head"><div><h2>Reliability insight</h2><p>Reliability model • REL-MULTI v1.2</p></div><StatusBadge tone={asset.risk}>{asset.risk} risk</StatusBadge></div><div className={`insight-callout ${!elevated?'insight-ok':''}`}><TrendingUp/><div><b>{elevated?'Abnormal operating pattern detected':'Operating within recent baseline'}</b><p>{elevated?'Multiple monitored signals have deviated from this asset’s recent baseline.':'No material multi-signal deviation is currently detected.'}</p></div></div><h4>Contributing evidence</h4><ul>{['Vibration increased relative to baseline','Temperature trend increased','Miss-pick frequency increased','Speed remains within configured range'].map((item,index)=><li key={item}><i className={elevated&&index<3?'bad':''}/>{elevated||index===3?item:item.replace('increased relative to','within').replace('trend increased','within baseline').replace('frequency increased','frequency normal')}</li>)}</ul><div className="model-note"><CircleAlert/><span><b>Model boundary</b><small>This insight identifies abnormal behavior associated with configured degradation modes; it does not assert an exact physical cause.</small></span></div><button className="primary wide" onClick={()=>{notify(`Investigation case created for ${asset.id}`);navigate('/cases')}}>Create investigation case</button></aside>
    </div>
    <section className="card asset-context"><div className="card-head"><div><h2>Asset context</h2><p>Configuration and recent workflow history</p></div><button onClick={()=>navigate(`/templates/${template.id}`)}>Open template <ArrowRight/></button></div><div className="context-grid"><div><Factory/><span><small>Template</small><b>{template.name}</b><em>v{template.version}</em></span></div><div><ShieldCheck/><span><small>Data readiness</small><b>{template.signals}/{template.signals} signals mapped</b><em>Updated 2 min ago</em></span></div><div><CircleAlert/><span><small>Recent maintenance</small><b>Routine inspection</b><em>{asset.lastService}</em></span></div></div></section>
  </div>;
}
