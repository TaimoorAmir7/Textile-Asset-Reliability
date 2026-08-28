import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { processAreas, templates } from '../domain/data';
import { MachineReference } from '../components/ui/MachineReference';
import { StatusBadge } from '../components/ui/StatusBadge';

export function DiscoverPage(){const navigate=useNavigate();return <div className="page">
  <section className="discover-hero"><div><div className="eyebrow light">INDUSTRY WORKSPACE</div><h1>Textiles & Apparel</h1><p>Asset reliability and operational intelligence from spinning and weaving through dyeing, finishing, garment production and shade quality.</p><div className="hero-stats"><div><b>16</b><span>Asset types</span></div><div><b>7</b><span>Deep templates</span></div><div><b>8</b><span>Process areas</span></div></div></div><img src="/assets/stenter.png" alt="Labeled stenter anatomy"/></section>
  <div className="section-title"><div><h2>Explore the production chain</h2><p>Browse the process hierarchy and available reliability configurations.</p></div></div>
  <div className="area-grid">{processAreas.map((area,index)=><button key={area.id} onClick={()=>navigate(`/templates?process=${area.id}`)}><span>{String(index+1).padStart(2,'0')}</span><b>{area.name}</b><small>{area.assets} deployed assets</small><ArrowRight/><p>{area.description}</p></button>)}</div>
  <div className="section-title"><div><h2>Recommended reliability templates</h2><p>Configured for representative textile operations</p></div><button onClick={()=>navigate('/templates')}>Browse library →</button></div>
  <div className="template-grid compact">{templates.slice(0,3).map(t=><article className="template-card" key={t.id} onClick={()=>navigate(`/templates/${t.id}`)}><MachineReference src={t.image} alt={`${t.name} machinery diagram`} className="template-img" label={t.process}/><div className="template-copy"><div className="template-top"><h3>{t.name}</h3><StatusBadge tone="Low">Active</StatusBadge></div><p>{t.description}</p><div className="template-meta"><span><b>{t.signals}</b> signals</span><span><b>{t.modes}</b> modes</span><span>v{t.version}</span></div><button>Open template <ArrowRight/></button></div></article>)}</div>
</div>}
