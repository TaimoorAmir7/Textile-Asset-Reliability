export const image = (name) => `/assets/${name}`;

export const processAreas = [
  { id:'spinning', name:'Spinning', assets:22, templates:4, description:'Fiber preparation, carding, drawing and yarn formation.' },
  { id:'warp', name:'Warp Preparation', assets:14, templates:3, description:'Warping, sizing and preparation for weaving.' },
  { id:'weaving', name:'Weaving', assets:48, templates:5, description:'Air-jet and rapier weaving operations.' },
  { id:'dyeing', name:'Dyeing & Printing', assets:18, templates:4, description:'Batch dyeing, recipe execution and process context.' },
  { id:'finishing', name:'Finishing', assets:14, templates:5, description:'Dimensional stability, drying and finishing lines.' },
  { id:'cut-sew', name:'Cut & Sew', assets:37, templates:5, description:'Spreading, cutting, sewing and garment assembly.' },
  { id:'utilities', name:'Utilities', assets:11, templates:3, description:'Compressed air, steam and plant utility systems.' },
  { id:'shade', name:'Shade Lab', assets:4, templates:2, description:'Instrument measurement and configurable acceptance.' },
];

export const templates = [
  {id:'air-jet-loom',name:'Air-Jet Loom Reliability',process:'Weaving',type:'Air-Jet Loom',signals:8,modes:5,kpis:6,version:'1.2',status:'Active',updated:'18 Aug 2026',image:image('air-jet-loom.png'),description:'Multi-signal reliability configuration for loom operating behavior, weft events and production performance.',signalNames:['Vibration RMS','Drive temperature','Machine speed','Miss-pick count','Warp tension','Unplanned stops','Air pressure','Runtime'],failureModes:['Vibration-related degradation','Temperature abnormality','Weft insertion abnormality','Tension abnormality','Operational performance degradation']},
  {id:'jet-dyeing',name:'Jet Dyeing Reliability',process:'Dyeing & Printing',type:'Jet Dyeing Machine',signals:7,modes:4,kpis:5,version:'1.0',status:'Active',updated:'14 Aug 2026',image:image('jet-dyeing.png'),description:'Process-context reliability monitoring for circulation, temperature profile and batch operation.',signalNames:['Bath temperature','Pump vibration','Pump current','Flow proxy','Pressure','Cycle state','Runtime'],failureModes:['Circulation deviation','Thermal profile deviation','Pump operating abnormality','Cycle performance degradation']},
  {id:'stenter',name:'Stenter Reliability',process:'Finishing',type:'Stenter',signals:9,modes:4,kpis:6,version:'1.1',status:'Active',updated:'09 Aug 2026',image:image('stenter.png'),description:'Zone-level operational monitoring for thermal uniformity, airflow and line stability.',signalNames:['Zone temperatures','Fan current','Exhaust state','Chain speed','Width setting','Fabric speed','Overfeed','Runtime','Stops'],failureModes:['Zone temperature imbalance','Circulation fan abnormality','Chain performance deviation','Line stability degradation']},
  {id:'compressor',name:'Compressor Reliability',process:'Utilities',type:'Compressor / Dryer',signals:6,modes:4,kpis:5,version:'1.0',status:'Active',updated:'02 Aug 2026',image:image('compressor.png'),description:'Reliability context for compressed-air generation, pressure stability and dryer performance.',signalNames:['Discharge pressure','Motor current','Vibration','Temperature','Dew point','Load state'],failureModes:['Pressure instability','Thermal abnormality','Vibration-related degradation','Dryer performance deviation']},
  {id:'sewing',name:'Sewing Machine Reliability',process:'Cut & Sew',type:'Sewing Machine',signals:5,modes:3,kpis:5,version:'1.0',status:'Active',updated:'29 Jul 2026',image:image('sewing-machine.png'),description:'Production and stoppage-pattern monitoring for industrial sewing operations.',signalNames:['Motor current','Run state','Cycle count','Stoppage duration','Thread-break events'],failureModes:['Abnormal stoppage pattern','Drive operating abnormality','Production performance degradation']},
  {id:'shade-quality',name:'Shade Quality',process:'Shade Lab',type:'Quality Process',signals:6,modes:0,kpis:6,version:'1.3',status:'Active',updated:'20 Aug 2026',image:image('spectrophotometer.png'),description:'Batch evaluation against client-configured shade standards and tolerances.',signalNames:['ΔL*','Δa*','Δb*','ΔC*','ΔH*','ΔE'],failureModes:[]},
];

export const assets = [
  {id:'AJ-003',name:'Air-Jet Loom',templateId:'air-jet-loom',area:'Weaving Shed A',plant:'Plant A',health:62,risk:'High',status:'Running',alerts:2,image:image('air-jet-loom.png'),lastService:'12 Aug 2026',runtime:'6,842 h',latest:'4.8 mm/s',signal:'Vibration RMS',owner:'Weaving Team A'},
  {id:'COMP-001',name:'Compressor / Dryer',templateId:'compressor',area:'Utilities',plant:'Plant A',health:65,risk:'High',status:'Running',alerts:1,image:image('compressor.png'),lastService:'04 Aug 2026',runtime:'12,401 h',latest:'7.4 bar',signal:'Discharge pressure',owner:'Utilities Team'},
  {id:'DYE-002',name:'Jet Dyeing Machine',templateId:'jet-dyeing',area:'Dye House',plant:'Plant A',health:78,risk:'Medium',status:'Running',alerts:1,image:image('jet-dyeing.png'),lastService:'30 Jul 2026',runtime:'4,128 h',latest:'126 °C',signal:'Bath temperature',owner:'Dye House Team'},
  {id:'STN-001',name:'Stenter',templateId:'stenter',area:'Finishing',plant:'Plant A',health:91,risk:'Low',status:'Running',alerts:0,image:image('stenter.png'),lastService:'18 Aug 2026',runtime:'8,219 h',latest:'182 °C',signal:'Zone average',owner:'Finishing Team'},
  {id:'SEW-014',name:'Sewing Machine',templateId:'sewing',area:'Cut & Sew',plant:'Plant A',health:87,risk:'Monitoring',status:'Idle',alerts:0,image:image('sewing-machine.png'),lastService:'15 Aug 2026',runtime:'2,112 h',latest:'2.1 stops/h',signal:'Stoppage frequency',owner:'Line 3'},
  {id:'AJ-017',name:'Air-Jet Loom',templateId:'air-jet-loom',area:'Weaving Shed B',plant:'Plant A',health:74,risk:'Medium',status:'Running',alerts:1,image:image('air-jet-loom.png'),lastService:'08 Aug 2026',runtime:'7,091 h',latest:'3.2 mm/s',signal:'Vibration RMS',owner:'Weaving Team B'},
];

export const alerts = [
  {id:'ALR-001',assetId:'AJ-003',title:'Multi-signal operating deviation',type:'Vibration anomaly',severity:'High',risk:'High',status:'Pending Investigation',detected:'21 Aug 2026, 10:20',assignee:'Amna Khan',score:.81,evidence:['Vibration RMS increased 23% relative to recent baseline','Drive temperature trend increased 11%','Miss-pick frequency increased 41%','Unplanned stoppages increased during the last 8 hours']},
  {id:'ALR-002',assetId:'COMP-001',title:'Compressed-air operating deviation',type:'Pressure behavior',severity:'Critical',risk:'Critical',status:'Investigating',detected:'21 Aug 2026, 09:42',assignee:'Bilal Ahmed',score:.88,evidence:['Discharge pressure oscillation exceeded configured band','Motor current variance increased','Dew-point signal remains available and within configured range']},
  {id:'ALR-003',assetId:'DYE-002',title:'Batch process deviation',type:'Process deviation',severity:'Medium',risk:'Medium',status:'New',detected:'21 Aug 2026, 08:54',assignee:'Unassigned',score:.63,evidence:['Temperature ramp differed from recent comparable batches','Circulation proxy moved outside configured monitoring band']},
  {id:'ALR-004',assetId:'SEW-014',title:'Abnormal stoppage pattern',type:'Stoppage pattern',severity:'Medium',risk:'Medium',status:'Resolved',detected:'20 Aug 2026, 15:18',assignee:'Sara Iqbal',score:.58,evidence:['Short-duration stops increased relative to line baseline']},
];

export const cases = [
  {id:'CASE-018',title:'AJ-003 Reliability Investigation',assetId:'AJ-003',alertId:'ALR-001',severity:'High',status:'Investigating',owner:'Amna Khan',created:'21 Aug, 10:22',due:'Today, 16:00',summary:'Investigate the multi-signal deviation and verify the configured vibration-related degradation mode before the next production run.'},
  {id:'CASE-015',title:'Compressor Pressure Investigation',assetId:'COMP-001',alertId:'ALR-002',severity:'Critical',status:'Action Required',owner:'Bilal Ahmed',created:'21 Aug, 09:51',due:'Today, 13:00',summary:'Review pressure stability, operating state, and recent utility demand context.'},
  {id:'CASE-011',title:'DYE-002 Process Review',assetId:'DYE-002',alertId:'ALR-003',severity:'Medium',status:'New',owner:'Unassigned',created:'21 Aug, 09:06',due:'22 Aug',summary:'Compare the current batch profile against recent comparable operating cycles.'},
];

export const workOrders = [
  {id:'WO-031',assetId:'AJ-003',task:'Inspect asset based on reliability alert',priority:'High',team:'Maintenance Team A',due:'21 Aug, 16:00',status:'Assigned',caseId:'CASE-018'},
  {id:'WO-029',assetId:'COMP-001',task:'Verify compressor pressure stability',priority:'Critical',team:'Utilities Maintenance',due:'21 Aug, 13:00',status:'In Progress',caseId:'CASE-015'},
  {id:'WO-026',assetId:'STN-001',task:'Inspect Zone 4 circulation fan',priority:'Medium',team:'Finishing Maintenance',due:'Completed',status:'Verified',caseId:'CASE-009'},
];

export const shadeBatches = [
  {id:'BATCH-001',standard:'STD-NAVY-001',product:'Woven Apparel Fabric',colour:'Navy',customer:'Azer Apparel Ltd.',deltaE:.42,measured:'21 Aug, 08:14',machine:'DYE-001'},
  {id:'BATCH-002',standard:'STD-NAVY-001',product:'Woven Apparel Fabric',colour:'Navy',customer:'Azer Apparel Ltd.',deltaE:.76,measured:'21 Aug, 09:02',machine:'DYE-001'},
  {id:'BATCH-003',standard:'STD-NAVY-001',product:'Woven Apparel Fabric',colour:'Navy',customer:'Azer Apparel Ltd.',deltaE:1.34,measured:'21 Aug, 09:48',machine:'DYE-002'},
  {id:'BATCH-004',standard:'STD-NAVY-001',product:'Woven Apparel Fabric',colour:'Navy',customer:'Azer Apparel Ltd.',deltaE:1.87,measured:'21 Aug, 10:31',machine:'DYE-002'},
];

export const telemetry = {
  'AJ-003': {vibration:[2.1,2.2,2.1,2.4,2.6,2.9,3.4,3.8,4.1,4.5,4.8],temperature:[65,65,66,66,67,68,70,72,74,76,78],speed:[738,742,741,745,744,740,743,742,739,741,742],missPicks:[2.2,2.4,2.3,2.8,3.1,4.2,5.8,7.1,9.4,11.2,12.4]},
  default:{vibration:[2.1,2.2,2.0,2.2,2.1,2.3,2.2,2.1,2.2,2.1,2.2],temperature:[64,64,65,64,65,64,65,64,64,65,64],speed:[740,741,739,742,741,743,741,740,742,741,742],missPicks:[2.1,2.2,2.1,2.3,2.2,2.4,2.2,2.1,2.3,2.2,2.3]}
};

export const liveColorBatch = {
  id:'LOT-4471', order:'ORD-92814', style:'WA-NAVY-24', customer:'Azer Apparel Ltd.',
  machine:'DYE-001', recipe:'Reactive Navy RX-5', standard:'STD-NAVY-001', fabric:'Woven cotton • 180 GSM',
  elapsed:47, duration:210, temperature:130, targetTemperature:130, predictedDeltaE:.60,
  recipeConfidence:94, similarLots:62, energy:9.1, averageEnergy:9.9,
  ingredients:[['Reactive Navy RX-5','3.42% owf'],['Reactive Blue B-19','0.86% owf'],['Salt','58 g/L'],['Soda ash','16 g/L']],
  phases:[['Load','Complete'],['Heat','Complete'],['Dye circulation','Active'],['Fixation','Queued'],['Rinse','Queued'],['Drop','Queued']],
};

export const apparelLines = [
  {id:'LINE-01',style:'Oxford Shirt',order:'ORD-92814',buyer:'Azer Apparel Ltd.',target:840,actual:786,efficiency:83.6,wip:148,status:'Attention',bottleneck:'Collar attach',operators:32,defects:1.8},
  {id:'LINE-02',style:'Chino Trouser',order:'ORD-92788',buyer:'Northstar Retail',target:720,actual:704,efficiency:91.2,wip:96,status:'On track',bottleneck:'None',operators:29,defects:1.1},
  {id:'LINE-03',style:'Workwear Jacket',order:'ORD-92742',buyer:'Atlas Workwear',target:480,actual:421,efficiency:78.4,wip:203,status:'At risk',bottleneck:'Sleeve setting',operators:36,defects:2.7},
];

export const visionRoll = {
  id:'ROLL-220', batch:'WB-1082', loom:'AJ-003', style:'WA-NAVY-24', width:'1.52 m', length:260, inspected:220,
  grade:'B', defectRate:.4, confidence:98.7,
  defects:[
    {id:'DEF-041',meter:38,type:'Weft stop',severity:'Minor',confidence:98.2,x:15,y:32},
    {id:'DEF-042',meter:86,type:'Oil mark',severity:'Major',confidence:99.1,x:34,y:61},
    {id:'DEF-043',meter:127,type:'Missing pick',severity:'Major',confidence:98.8,x:51,y:39},
    {id:'DEF-044',meter:178,type:'Reed mark',severity:'Minor',confidence:97.4,x:70,y:70},
    {id:'DEF-045',meter:213,type:'Missing pick',severity:'Critical',confidence:99.4,x:84,y:45},
  ],
};
