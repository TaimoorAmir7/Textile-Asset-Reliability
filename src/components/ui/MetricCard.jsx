import { ArrowUpRight } from 'lucide-react';
export function MetricCard({ label, value, meta, tone='neutral', onClick }) {
  return <button className="kpi" onClick={onClick}><div><span>{label}</span><b>{value}</b><small className={tone}>{meta}</small></div><ArrowUpRight className="kpi-arrow" /></button>;
}
