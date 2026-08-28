import { useMemo, useState } from 'react';

const series = {
  Live:{actual:[68,70,69,73,75,78,81,79,84,82,86,85,88,84,80],expected:[67,69,71,72,74,77,79,81,82,83,84,86,86,85,82]},
  Shift:{actual:[71,72,74,73,77,79,80,82,81,84,86,85,87,88,86],expected:[70,71,72,74,75,77,79,80,82,83,84,85,86,87,87]},
};
const times=['06:00','06:30','07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','Now'];
const W=900,H=340,left=68,right=862,top=38,bottom=286,min=64,max=92;
const x=index=>left+index*((right-left)/(times.length-1));
const y=value=>bottom-(value-min)/(max-min)*(bottom-top);
const linePath=values=>values.map((value,index)=>`${index?'L':'M'} ${x(index)} ${y(value)}`).join(' ');

export function OperationsTrend(){
  const [range,setRange]=useState('Live'),[hovered,setHovered]=useState(null);
  const data=series[range];
  const areaPath=useMemo(()=>`${linePath(data.actual)} L ${right} ${bottom} L ${left} ${bottom} Z`,[data]);
  return <section className="card operations-trend"><div className="card-head"><div><h2>Weaving performance vs. operating baseline</h2><p>Normalized production index • live operational context</p></div><div className="segmented"><button className={range==='Live'?'active':''} onClick={()=>setRange('Live')}>Real-time</button><button className={range==='Shift'?'active':''} onClick={()=>setRange('Shift')}>Shift view</button></div></div>
    <div className="trend-legend"><span><i className="actual"/>Actual performance</span><span><i className="expected"/>Recent baseline</span><b><i/> Live • 2 s refresh</b></div>
    <div className="operations-chart-wrap"><svg viewBox={`0 0 ${W} ${H}`} className="operations-chart premium-chart" role="img" aria-label="Weaving performance compared to recent baseline"><defs><linearGradient id="operationsArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#11826b" stopOpacity=".28"/><stop offset="1" stopColor="#11826b" stopOpacity=".025"/></linearGradient><filter id="pointShadow"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity=".18"/></filter></defs>
      {[64,68,72,76,80,84,88,92].map(value=><g className="chart-grid-row" key={value}><line x1={left} y1={y(value)} x2={right} y2={y(value)}/><text x={left-16} y={y(value)+4} textAnchor="end">{value}</text></g>)}
      {[0,4,8,12,14].map(index=><g className="chart-x-tick" key={index}><line x1={x(index)} y1={bottom} x2={x(index)} y2={bottom+6}/><text x={x(index)} y={bottom+28} textAnchor={index===0?'start':index===14?'end':'middle'}>{times[index]}</text></g>)}
      <text className="axis-title" x="18" y="28">INDEX</text><path d={areaPath} fill="url(#operationsArea)" className="chart-area"/><path d={linePath(data.expected)} className="expected-path"/><path d={linePath(data.actual)} className="actual-path-premium"/>
      {data.actual.map((value,index)=><g key={times[index]} onMouseEnter={()=>setHovered(index)} onMouseLeave={()=>setHovered(null)} className="chart-hit"><circle className="hit-target" cx={x(index)} cy={y(value)} r="13"/><circle className={index===data.actual.length-1?'data-point latest':'data-point'} cx={x(index)} cy={y(value)} r={index===data.actual.length-1?6:4}/></g>)}
      {hovered!==null&&<g className="chart-tooltip" transform={`translate(${Math.min(x(hovered),right-70)},${Math.max(y(data.actual[hovered])-64,8)})`}><rect x="-58" y="0" width="116" height="49" rx="7"/><text x="-45" y="19">{times[hovered]}</text><text x="-45" y="38" className="tooltip-value">{data.actual[hovered]} actual • {data.expected[hovered]} baseline</text><line x1="0" y1="49" x2="0" y2={Math.max(12,y(data.actual[hovered])-(Math.max(y(data.actual[hovered])-64,8)))}/></g>}
    </svg></div>
    <footer className="chart-summary"><span><b>80</b> current index</span><span><b>-2</b> vs. baseline</span><span><b>88</b> shift peak</span><strong>Updated just now</strong></footer>
  </section>;
}
