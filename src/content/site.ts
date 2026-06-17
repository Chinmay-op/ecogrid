export const site = {
  name: "OmniView IQ",
  tagline: "The triple-impact engine for industrial energy, compliance, and carbon.",
  subTagline: "From reactive reporting to proactive value creation.",
  cta: "Start Saving — Book a Free Energy Audit",
  credit: "Prepared by Mightium · Target market: Indian industrial facilities",
  heroModules: ["PREDICT", "OPTIMISE", "MONETISE & COMPLY"],
} as const;

export const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "Platform", href: "#platform" },
  { label: "Modules", href: "#modules" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const problem = {
  title: "You Are Running Your Energy Operations Blind — And in Reverse.",
  body: "Energy makes up 15–30%+ of your operating cost, yet critical decisions are made only after the monthly bill arrives. By then, the damage is done.",
  highlight: {
    title: "The 15-Minute Penalty Window",
    body: "Indian industrial tariffs average peak demand over a rolling 15-minute window. A single brief spike locks in penal rates of 1.5–2× for the entire month. Manual reporting cannot prevent this.",
  },
} as const;

export const silentWaste = [
  {
    source: "The Penalty Trap",
    detail: "1.5–2× penal rates on excess demand, driven entirely by blind scheduling",
  },
  {
    source: "The Idle Giants",
    detail: "Oversized and idling induction motors consume roughly 66% of your total power",
  },
  {
    source: "The Hidden Leaks",
    detail: "20–30% of a compressor's output is lost to undetected air leaks",
  },
  {
    source: "The Unclaimed Prize",
    detail:
      "Genuine green efforts go unmonetised, while missing new CCTS carbon rules triggers a 2× non-recoverable penalty",
  },
] as const;

export const threeWins = [
  {
    result: "60–70% Cut in Demand Penalties",
    meaning: "Achieved within the first quarter via AI-driven forecasting and load shedding",
  },
  {
    result: "15–30% Energy Savings",
    meaning:
      "Captured on targeted high-waste systems, compounding over a 1–3 year facility-wide rollout",
  },
  {
    result: "₹5L – ₹15L+ New Carbon Revenue",
    meaning: "Turning verified, metered savings into tradeable carbon assets for large emitters",
  },
] as const;

export const howItWorks = [
  {
    step: "See",
    title: "See",
    body: "Smart meters and PLCs feed a live Digital Twin, creating one verified source of truth for the entire facility.",
  },
  {
    step: "Predict",
    title: "Predict",
    body: "AI (LSTM + XGBoost) forecasts your peak demand 24 hours ahead, shedding load before you cross the sanctioned penalty limit.",
  },
  {
    step: "Fix",
    title: "Fix",
    body: "Real-time correction of power factor surcharges, drifting HVAC setpoints, and costly compressed air leaks.",
  },
  {
    step: "Shift",
    title: "Shift",
    body: "Automated shifting moves consumption into mandatory Time-of-Day solar and off-peak tariff hours, unlocking 10–20% cheaper rates.",
  },
] as const;

export const platformLayers = [
  {
    layer: "Layer 1: Sense",
    detail: "Smart meters, thermal sensors, and vibration monitors capturing reality at the source",
  },
  {
    layer: "Layer 2: Connect",
    detail:
      "Secure edge gateways normalizing protocols (Modbus, OPC-UA) without ripping and replacing hardware",
  },
  {
    layer: "Layer 3: Model",
    detail: "A live, FMI-compliant Digital Twin mirroring the facility's energy profile",
  },
  {
    layer: "Layer 4: Intelligence",
    detail: "AI forecasting, ROI-ranked recommendations, and automated demand response",
  },
  {
    layer: "Layer 5: Monetise",
    detail:
      "Automated dMRV, ISO 14064 accounting, blockchain audit trails, and tradeable carbon credits",
  },
] as const;

export const comparison = [
  {
    aspect: "Data Source",
    point: "Disconnected spreadsheets & manual audits",
    omni: "One Live Digital Twin",
  },
  {
    aspect: "Actionability",
    point: "Manual analysis after the breach",
    omni: "Day-ahead alerts & sub-second automated curtailment",
  },
  {
    aspect: "Value Curve",
    point: "Plateaus after the initial fix",
    omni: "Compounds — every kilowatt saved automatically mints a carbon credit",
  },
  {
    aspect: "Verification",
    point: "Slow, expensive periodic consultants",
    omni: "Automated dMRV blockchain ledger that drastically cuts verification costs",
  },
] as const;

export const modules = [
  {
    name: "PREDICT",
    body: "AI maximum-demand forecasting and day-ahead breach alerts.",
    outcome: "Kills demand penalties.",
    tier: "Included in Starter Tier",
  },
  {
    name: "OPTIMISE",
    body: "24/7 AI energy auditor for HVAC, motors, and scheduling.",
    outcome: "Kills operational waste.",
    tier: "Added in Professional Tier",
  },
  {
    name: "MONETISE & COMPLY",
    body: "Automated dMRV, blockchain ledger, and CCTS / BRSR reporting.",
    outcome: "Mints carbon revenue.",
    tier: "Added in Enterprise Tier",
  },
] as const;

export const stakeholders = [
  {
    role: "CFO",
    view: "Rupees saved, new carbon revenue, and a verified 12–18 month payback period",
  },
  {
    role: "Plant Manager",
    view: "Real-time loads, equipment health, and one-tap automated curtailment alerts",
  },
  {
    role: "Sustainability Head",
    view: "CO₂ avoided and verifier-ready CCTS/BRSR compliance reports instantly",
  },
  {
    role: "Energy Manager",
    view: "Consumption analytics and continuously learning, ROI-ranked optimization recommendations",
  },
] as const;

export const scorecard = {
  financial: [
    "60–70% reduction in excess-demand charges",
    "15–30% targeted energy-cost reduction",
    "6–12 months APFC payback — power-factor surcharges eliminated",
    "12–18 months total system payback",
  ],
  operational: [
    "95%+ forecast accuracy on aggregate loads",
    "40–60% reduction in manual reporting time via automated MIS",
    "25–35% faster compliance cycles",
    "Day-ahead breach alerts guaranteeing intervention before limits are hit",
  ],
} as const;

export const pricingTiers = [
  {
    tier: "Starter",
    bestFor: "A single facility chasing demand penalties and PF",
    included: "Core Power module + Command Center + PREDICT",
  },
  {
    tier: "Professional",
    bestFor: "An energy-intensive plant going after whole-system savings",
    included:
      "Core Power + Thermal/Air/Rotating modules + PREDICT + OPTIMISE + Digital Twin",
  },
  {
    tier: "Enterprise",
    bestFor: "Multi-site or CCTS/BRSR-obligated groups",
    included:
      "Full hardware suite + all software modules + MONETISE + COMPLY + multi-site rollup",
  },
] as const;

export const beyond = [
  {
    title: "Financial",
    body: "A permanent hedge against tariff volatility and a driver of pure bottom-line savings.",
  },
  {
    title: "Regulatory",
    body: "Complete readiness for expanding CCTS targets and CBAM border reporting with zero panic.",
  },
  {
    title: "Environmental",
    body: "Measurable CO₂ avoidance tied directly to Net-Zero compliance and green finance access.",
  },
  {
    title: "Cultural",
    body: "Your sustainability department stops being a reporting burden and becomes a verifiable profit center.",
  },
] as const;

export const closing = {
  headline: "Don't just manage energy. Master it.",
  body: "OmniView IQ turns a controllable cost, an invisible waste, and an unclaimed asset into one compounding system of value — financial, operational, environmental, and strategic.",
} as const;
