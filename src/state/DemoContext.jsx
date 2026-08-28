import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { assets as seedAssets, shadeBatches as seedBatches } from '../domain/data';

const DemoContext = createContext(null);

export function DemoProvider({ children }) {
  const [scenario, setScenarioState] = useState('loom');
  const [assets, setAssets] = useState(seedAssets);
  const [shadeTolerance, setShadeTolerance] = useState(1);
  const [batches, setBatches] = useState(seedBatches);
  const [toast, setToast] = useState('');

  const notify = useCallback(message => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }, []);

  const setScenario = useCallback(next => {
    setScenarioState(next);
    setAssets(seedAssets.map(asset => {
      if (next === 'normal') return {...asset, health: Math.max(asset.health, 88), risk:'Low', alerts:0};
      if (next === 'compressor' && asset.id === 'COMP-001') return {...asset, health:42, risk:'Critical', alerts:2};
      return asset;
    }));
    if (next === 'shade') setBatches(seedBatches.map((batch, index) => index === 0 ? {...batch, deltaE:1.48} : batch));
    else setBatches(seedBatches);
    notify(`Scenario applied: ${next.replace('-', ' ')}`);
  }, [notify]);

  const resetDemo = useCallback(() => {
    setScenarioState('loom'); setAssets(seedAssets); setShadeTolerance(1); setBatches(seedBatches);
    notify('Operating state restored to its baseline');
  }, [notify]);

  const saveShadeTolerance = useCallback(value => {
    setShadeTolerance(value); notify(`Shade tolerance updated to ${value.toFixed(2)}`);
  }, [notify]);

  const value = useMemo(() => ({scenario,setScenario,assets,shadeTolerance,saveShadeTolerance,batches,notify,resetDemo}), [scenario,setScenario,assets,shadeTolerance,saveShadeTolerance,batches,notify,resetDemo]);
  return <DemoContext.Provider value={value}>{children}{toast && <div className="toast">✓ {toast}</div>}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within DemoProvider');
  return context;
}
