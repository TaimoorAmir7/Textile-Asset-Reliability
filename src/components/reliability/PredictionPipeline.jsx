import { Activity, BrainCircuit, CalendarClock, Check, Cpu, PackageCheck, RadioTower, Sparkles } from 'lucide-react';

const stages = [
  { icon:RadioTower, label:'Sensor layer', detail:'4 live signals', meta:'2 s sampling' },
  { icon:Cpu, label:'Feature engine', detail:'18 derived features', meta:'8 h window' },
  { icon:BrainCircuit, label:'Risk model', detail:'Multi-signal deviation', meta:'REL-MULTI v1.2' },
  { icon:CalendarClock, label:'Action plan', detail:'Inspection proposed', meta:'Operator approval' },
];

export function PredictionPipeline({ asset, anomaly, elevated }) {
  const evidence = elevated ? [
    ['Vibration envelope', 34, '4.8 mm/s • +23%'],
    ['Miss-pick frequency', 27, '12.4 /1k • +41%'],
    ['Drive temperature', 22, '78°C • +11%'],
    ['Operational context', 17, 'Speed remains stable'],
  ] : [
    ['Signal stability', 42, 'Within recent baseline'],
    ['Operating context', 29, 'No abnormal state change'],
    ['Event frequency', 18, 'Normal range'],
    ['Data quality', 11, 'All required signals available'],
  ];

  return <section className="card prediction-pipeline">
    <div className="card-head"><div><h2>How the reliability decision is formed</h2><p>Live signals are converted into explainable evidence before an operator action is proposed.</p></div><span className="decision-live"><i/> Decision engine live</span></div>
    <div className="pipeline-track">{stages.map(({icon:Icon,label,detail,meta},index)=><div className={`pipeline-stage ${index===2&&elevated?'risk':''}`} key={label}><span><Icon/></span><small>0{index+1}</small><b>{label}</b><strong>{detail}</strong><em>{meta}</em>{index<stages.length-1&&<i className="pipeline-link"><i/></i>}</div>)}</div>
    <div className="explain-grid">
      <div className="contribution-panel"><div className="section-label"><Activity/> WHY THE SCORE MOVED</div><h3>{elevated ? 'Three signals explain 83% of the current deviation' : 'The asset remains inside its learned operating envelope'}</h3>{evidence.map(([label,weight,value])=><div className="contribution" key={label}><span><b>{label}</b><small>{value}</small></span><i><i style={{width:`${weight*2.1}%`}}/></i><strong>{weight}%</strong></div>)}<footer><Sparkles/><span><b>Anomaly score {anomaly.toFixed(2)}</b><small>Evidence is directional and does not claim a confirmed physical fault.</small></span></footer></div>
      <aside className={`forecast-card ${elevated?'attention':''}`}><div className="section-label"><CalendarClock/> PLANNING RECOMMENDATION</div><span className="forecast-horizon">{elevated?'5–8':'30+'}<small>{elevated?'days to inspect':'days stable outlook'}</small></span><h3>{elevated?'Inspect drive-side bearing and nozzle-bank condition':'Continue routine monitoring'}</h3><p>{elevated?'This window is based on the present trend and production context; it is not a guaranteed failure date.':'No condition-based work is required beyond the approved preventive plan.'}</p><div className="forecast-readiness"><span><PackageCheck/><small>Parts readiness</small><b>{elevated?'Bearing kit available':'Not required'}</b></span><span><CalendarClock/><small>Proposed window</small><b>{elevated?'Fri 22 Aug • 02:00':'Next PM cycle'}</b></span></div><button><Check/> Review in maintenance plan</button></aside>
    </div>
  </section>;
}
