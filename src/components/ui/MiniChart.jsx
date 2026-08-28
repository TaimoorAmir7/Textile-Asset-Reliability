export function MiniChart({ values, color='#117964', height=110 }) {
  const max=Math.max(...values), min=Math.min(...values), range=max-min || 1;
  const points=values.map((value,index)=>`${index*100/(values.length-1)},${48-(value-min)/range*38}`).join(' ');
  const last=points.split(' ').at(-1).split(',');
  return <svg className="spark" viewBox="0 0 100 52" preserveAspectRatio="none" style={{height}} aria-label="Telemetry trend chart">
    <path d="M0 48H100" className="gridline" />
    <polyline points={points} style={{stroke:color}} />
    <circle cx={last[0]} cy={last[1]} r="2.4" style={{fill:color}} />
  </svg>;
}
