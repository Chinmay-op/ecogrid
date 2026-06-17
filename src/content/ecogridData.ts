/* Layer copy + palette â€” single source of truth shared by DOM and WebGL */
export const LAYERS = [
  {
    key: '0',
    id: 'l1',
    n: '01',
    name: 'L1 · SENSE',
    hex: '#111111',
    color: 0x111111,
    title: 'Touch the metal.',
    sub: 'SMART METERS & SENSORS',
    body: `Current transformers, power-quality meters, vibration and thermal
           probes on every feeder and machine. Not the utility meter at the
           gate â€” the press, the compressor, the furnace itself, sampled at
           one-second resolution.`,
    specs: [
      ['SAMPLING', '1 s Â· CLASS 0.5S'],
      ['PARAMETERS', 'kWh Â· PF Â· THD Â· TEMP'],
      ['COVERAGE', 'MACHINE-LEVEL'],
    ],
    side: 'right',
  },
  {
    key: '1',
    id: 'l2',
    n: '02',
    name: 'L2 · CONNECT',
    hex: '#222222',
    color: 0x222222,
    title: 'One language for the shop floor.',
    sub: 'EDGE GATEWAYS & PROTOCOL NORMALISATION',
    body: `Edge compute units speak Modbus, OPC-UA and MQTT to legacy PLCs
           and modern drives alike, then carry every reading over encrypted
           links — with store-and-forward, so a network outage never becomes
           a data outage.`,
    specs: [
      ['PROTOCOLS', 'MODBUS · OPC-UA · MQTT'],
      ['TRANSPORT', 'TLS 1.3 · 4G/LAN'],
      ['RESILIENCE', '72 h EDGE BUFFER'],
    ],
    side: 'right',
  },
  {
    key: '2',
    id: 'l3',
    n: '03',
    name: 'L3 · MODEL',
    hex: '#444444',
    color: 0x444444,
    title: 'A living twin of the plant.',
    sub: 'LIVE, FMI-COMPLIANT DIGITAL TWIN',
    body: `Every feeder, line, shift and SKU mapped into a digital twin that
           mirrors the facility's energy profile in real time. Energy stops
           being one number on a bill and becomes a navigable model — cost
           per machine, per batch, per unit produced.`,
    specs: [
      ['GRANULARITY', 'FEEDER → MACHINE → BATCH'],
      ['BASELINES', 'SHIFT & SEASON'],
      ['ALLOCATION', '₹ / UNIT PRODUCED'],
    ],
    side: 'right',
  },
  {
    key: '3',
    id: 'l4',
    n: '04',
    name: 'L4 · INTELLIGENCE',
    hex: '#666666',
    color: 0x666666,
    title: 'Forecasts before the bill does.',
    sub: 'AI FORECASTING & DEMAND RESPONSE',
    body: `AI demand forecasting, anomaly detection and time-of-day
           optimisation. The stack flags a failing motor by its signature,
           shaves peaks before penalty slabs, and schedules loads against
           tariff windows — automatically.`,
    specs: [
      ['FORECAST', 'DAY-AHEAD · 15-MIN'],
      ['DETECTION', 'ANOMALY < 5 MIN'],
      ['OPTIMISATION', 'ToD · PEAK · PF'],
    ],
    side: 'right',
  },
  {
    key: '4',
    id: 'l5',
    n: '05',
    name: 'L5 · MONETISE',
    hex: '#888888',
    color: 0x888888,
    title: 'Compliance becomes cash flow.',
    sub: 'AUTOMATED dMRV & CARBON CREDITS',
    body: `Verified savings roll up into CCTS-ready reporting and
           carbon-credit pipelines. The same data that cuts the bill earns
           credits — audit-grade, MRV-aligned, settlement-ready.`,
    specs: [
      ['FRAMEWORK', 'CCTS · PAT ALIGNED'],
      ['EVIDENCE', 'MRV-GRADE TRAIL'],
      ['OUTPUT', 'tCO₂e → ₹'],
    ],
    side: 'right',
  },
]
