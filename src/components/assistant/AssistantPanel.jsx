import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, LoaderCircle, MessageCircle, Send, Sparkles, WifiOff, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDemo } from '../../state/DemoContext';

const knowledge = [
  { match:['aj-003','loom','vibration'], answer:'AJ-003 is at high reliability risk with a current health score of 62. The operating evidence combines rising vibration, temperature, miss-picks and stoppages.', action:'/alerts/ALR-001', label:'Open ALR-001' },
  { match:['shade','batch','delta','Δe','recipe','color'], answer:'Color intelligence combines recipe history, live batch conditions and the customer shade rule. Final acceptance still comes from the verified spectrophotometer reading.', action:'/shade', label:'Open color intelligence' },
  { match:['vision','defect','roll','inspection','missing pick'], answer:'The vision workflow maps every detected defect to a roll position, preserves model confidence and traces the production context back to the source batch and loom.', action:'/vision', label:'Open fabric inspection' },
  { match:['apparel','sewing line','bottleneck','wip','operator'], answer:'Apparel operations follows orders from cutting through packing, comparing actual output with target while identifying WIP queues and line-balancing opportunities.', action:'/apparel', label:'Open apparel operations' },
  { match:['deploy','template','map'], answer:'The deployment flow maps template signals to plant sources, validates coverage, configures thresholds and previews the resulting asset workspace.', action:'/deploy', label:'Open deployment' },
  { match:['maintenance','work order','case'], answer:'Cases hold the investigation record; work orders hold the maintenance task. The active AJ-003 case is linked to WO-031.', action:'/cases', label:'Open workbench' },
];

const defaultReply = { answer:'For a complete operating review, start with AJ-003, review its evidence, create a case and work order, then compare that reliability flow with BATCH-003 shade evaluation.', action:'/assets/AJ-003', label:'Start review' };

function matchingAction(text) {
  const lower = text.toLowerCase();
  const hit = knowledge.find(item => item.match.some(word => lower.includes(word)));
  return hit ? { action:hit.action, label:hit.label } : {};
}

export function AssistantPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('checking');
  const [messages, setMessages] = useState([{ role:'assistant', text:'I can locate an asset, summarize live operating evidence, or guide you through the reliability, quality and maintenance workflows.' }]);
  const messagesEnd = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { setScenario, scenario, assets, batches, shadeTolerance } = useDemo();

  const contextual = useMemo(() => location.pathname.startsWith('/alerts') ? 'Explain why this alert was created' : location.pathname.startsWith('/shade') ? 'Explain this live color recommendation' : location.pathname.startsWith('/vision') ? 'Explain how this defect is traced' : location.pathname.startsWith('/apparel') ? 'Explain the current line bottleneck' : location.pathname.startsWith('/assets') ? 'Summarize this asset’s health' : 'Show me the end-to-end operating flow', [location.pathname]);

  useEffect(() => {
    fetch('/api/chat/status').then(response => response.ok ? response.json() : Promise.reject()).then(status => setMode(status.configured ? 'ai' : 'fallback')).catch(() => setMode('fallback'));
  }, []);

  useEffect(() => {
    if (open) messagesEnd.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, loading, open]);

  const submit = async (value = input) => {
    const text = value.trim();
    if (!text || loading) return;
    const priorMessages = messages;
    setMessages(items => [...items, { role:'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ message:text, history:priorMessages.slice(-8), context:{ route:location.pathname, scenario, assets:assets.map(({ id, health, risk, status, alerts: alertCount, latest }) => ({ id, health, risk, status, alertCount, latest })), batches:batches.map(({ id, deltaE, machine }) => ({ id, deltaE, machine })), shadeTolerance } }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.answer) throw new Error(data.error || 'Assistant request failed');
      setMode('ai');
      setMessages(items => [...items, { role:'assistant', text:data.answer, ...matchingAction(text) }]);
    } catch {
      const fallback = knowledge.find(item => item.match.some(word => text.toLowerCase().includes(word))) || defaultReply;
      setMode('fallback');
      setMessages(items => [...items, { role:'assistant', text:fallback.answer, action:fallback.action, label:fallback.label, fallback:true }]);
    } finally {
      setLoading(false);
    }
  };

  const modeLabel = mode === 'ai' ? 'Mistral connected' : mode === 'checking' ? 'Checking connection' : 'Operations guide';
  return <>
    <button className={`assistant-fab ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="Open reliability assistant">{open ? <X/> : <Sparkles/>}<span>Help</span></button>
    {open && <aside className="assistant-panel">
      <header><div><span><Sparkles/></span><div><b>Spark Technologies Assistant</b><small className={mode === 'fallback' ? 'offline' : ''}>{mode === 'fallback' ? <WifiOff/> : <i/>}{modeLabel} • plant context</small></div></div><button onClick={() => setOpen(false)} aria-label="Close assistant"><X/></button></header>
      <div className="assistant-context"><MessageCircle/><span>Current page</span><b>{location.pathname === '/' ? 'Operations overview' : location.pathname.slice(1).replaceAll('-', ' ')}</b></div>
      <div className="assistant-messages">{messages.map((message, index) => <div className={`assistant-message ${message.role}`} key={index}><p>{message.text}</p>{message.fallback && <small>Answered from the built-in operations guide.</small>}{message.action && <button onClick={() => { navigate(message.action); setOpen(false); }}>{message.label}<ArrowRight/></button>}</div>)}{loading && <div className="assistant-message assistant typing"><p><LoaderCircle/><span>Reviewing operational context…</span></p></div>}<div ref={messagesEnd}/></div>
      <div className="assistant-suggestions"><button onClick={() => submit(contextual)} disabled={loading}>{contextual}</button><button onClick={() => { setScenario('loom'); setMessages(items => [...items, { role:'assistant', text:'Loom degradation profile applied. AJ-003 is now the primary high-risk investigation.' }]); }}>Apply loom profile</button></div>
      <form onSubmit={event => { event.preventDefault(); submit(); }}><input value={input} onChange={event => setInput(event.target.value)} placeholder="Ask about this operation..." disabled={loading}/><button aria-label="Send" disabled={loading || !input.trim()}>{loading ? <LoaderCircle className="spin"/> : <Send/>}</button></form>
      <footer>{mode === 'ai' ? 'AI responses use current platform context. Verify recommendations before operational action.' : 'Add the Mistral server key to .env to enable AI responses.'}</footer>
    </aside>}
  </>;
}
