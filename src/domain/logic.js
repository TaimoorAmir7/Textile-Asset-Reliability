export function classifyRisk(health, anomaly) {
  if (health < 50 || anomaly >= .9) return 'Critical';
  if (health < 70 || anomaly >= .75) return 'High';
  if (health < 82 || anomaly >= .55) return 'Medium';
  if (health < 92 || anomaly >= .35) return 'Monitoring';
  return 'Low';
}

export function evaluateShadeRule(deltaE, tolerance) {
  return { result: deltaE <= tolerance ? 'Pass' : 'Fail', margin: +(tolerance - deltaE).toFixed(2) };
}

export function calculateAnomalyScore(series, baselineCount = 5) {
  const baseline = series.slice(0, baselineCount);
  const recent = series.slice(-3);
  const avg = values => values.reduce((sum, value) => sum + value, 0) / values.length;
  const base = avg(baseline);
  return Math.min(.99, Math.max(0, +(Math.abs(avg(recent) - base) / Math.max(base, .01)).toFixed(2)));
}

export function buildTimeline(alert) {
  if (alert.id !== 'ALR-001') return [
    {time:'08:54', title:'Configured deviation detected', detail:alert.type},
    {time:'09:01', title:'Alert generated', detail:`Anomaly score ${alert.score}`},
    {time:'09:06', title:'Review pending', detail:`Assigned to ${alert.assignee}`},
  ];
  return [
    {time:'08:10', title:'Vibration trend begins increasing', detail:'Above recent operating baseline'},
    {time:'09:15', title:'Temperature deviation detected', detail:'Second contributing signal'},
    {time:'10:05', title:'Miss-pick frequency increases', detail:'Multi-signal condition reached'},
    {time:'10:20', title:'High-risk alert generated', detail:'Anomaly score 0.81'},
    {time:'10:22', title:'Investigation case created', detail:'CASE-018'},
  ];
}
