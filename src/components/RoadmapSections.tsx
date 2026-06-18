import styles from "./RoadmapSections.module.css";

export function RoadmapSections() {
  return (
    <div className={styles.productContainer}>
      
      {/* SECTION: THE PROBLEM */}
      <section className={`${styles.productSection} ${styles.bgDark}`} id="problem" data-key="problem">
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.headline}>You Are Running Your Energy Operations Blind.</h2>
            <p className={styles.subheadline}>
              Energy makes up <strong>15–30%+</strong> of your operating cost — yet every critical decision is made <em>after</em> the monthly bill arrives.
            </p>
          </div>
          
          <div className={styles.bentoGrid}>
            <div className={styles.bentoCard}>
              <div className={styles.bentoIcon}>⚠️</div>
              <h3>The Penalty Trap</h3>
              <p>Indian HT industrial tariffs average peak demand over a rolling 15-minute window. A single brief spike locks in penal rates of <strong className={styles.textHighlight}>1.5–2×</strong> for the entire month.</p>
            </div>
            <div className={styles.bentoCard}>
              <div className={styles.bentoIcon}>💨</div>
              <h3>The Silent Waste</h3>
              <p>Oversized and idling induction motors consume roughly <strong className={styles.textHighlight}>66% of your total power</strong>. Compressed-air leaks silently waste 20–30% of compressor output.</p>
            </div>
            <div className={styles.bentoCard}>
              <div className={styles.bentoIcon}>🌱</div>
              <h3>The Unclaimed Prize</h3>
              <p>Genuine green efforts go unmonetised. Missing new CCTS carbon rules triggers a <strong className={styles.textHighlight}>2× non-recoverable penalty</strong>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: METRICS / WHAT YOU CAN RECOVER */}
      <section className={`${styles.productSection} ${styles.bgGradient}`} data-key="recover">
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.headline}>What You Can Recover</h2>
            <p className={styles.subheadline}>Tangible outcomes driven by AI and automated load shedding.</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>60–70%</div>
              <div className={styles.statLabel}>Cut in Demand Penalties</div>
              <div className={styles.statDesc}>Achieved within Q1 via AI-driven forecasting and load shedding.</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>15–30%</div>
              <div className={styles.statLabel}>Energy Savings</div>
              <div className={styles.statDesc}>Captured on targeted high-waste systems, compounding over 1–3 years.</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>₹5L–15L+</div>
              <div className={styles.statLabel}>New Carbon Revenue / yr</div>
              <div className={styles.statDesc}>Turning verified, metered savings into tradeable carbon assets.</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>12–18 mo</div>
              <div className={styles.statLabel}>System Payback Period</div>
              <div className={styles.statDesc}>AI-operations leader benchmark.</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: STAKEHOLDERS / ONE PANE OF GLASS */}
      <section className={`${styles.productSection} ${styles.bgCards}`} id="modules" data-key="value">
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.headline}>One Pane of Glass.<br/>Four Distinct Victories.</h2>
            <p className={styles.subheadline}>A single dashboard that speaks each stakeholder&apos;s language — from rupees to carbon tonnes.</p>
          </div>
          
          <div className={styles.stakeholderGrid}>
            <div className={styles.stakeholderCard}>
              <div className={styles.stakeholderIcon}>💰</div>
              <h3>CFO</h3>
              <p className={styles.stakeholderLead}>Financial clarity at a glance.</p>
              <ul className={styles.stakeholderList}>
                <li>Rupees saved across demand penalties, energy waste, and PF surcharges</li>
                <li>New carbon revenue from verified credit generation</li>
                <li>Verified 12–18 month full-system payback period</li>
                <li>ROI dashboards with monthly trend tracking</li>
              </ul>
            </div>
            <div className={styles.stakeholderCard}>
              <div className={styles.stakeholderIcon}>🏭</div>
              <h3>Plant Manager</h3>
              <p className={styles.stakeholderLead}>Operational control in real time.</p>
              <ul className={styles.stakeholderList}>
                <li>Live load monitoring across all feeders and equipment</li>
                <li>Equipment health scoring with predictive maintenance alerts</li>
                <li>One-tap automated curtailment during peak demand windows</li>
                <li>Shift-wise energy consumption breakdowns</li>
              </ul>
            </div>
            <div className={styles.stakeholderCard}>
              <div className={styles.stakeholderIcon}>⚡</div>
              <h3>Energy Manager</h3>
              <p className={styles.stakeholderLead}>Analytics that learn and improve.</p>
              <ul className={styles.stakeholderList}>
                <li>Consumption analytics with anomaly detection</li>
                <li>Continuously learning, ROI-ranked optimisation recommendations</li>
                <li>Digital Twin what-if simulations before implementing changes</li>
                <li>40–60% reduction in manual reporting via automated MIS</li>
              </ul>
            </div>
            <div className={styles.stakeholderCard}>
              <div className={styles.stakeholderIcon}>🌱</div>
              <h3>Sustainability Head</h3>
              <p className={styles.stakeholderLead}>Compliance without the panic.</p>
              <ul className={styles.stakeholderList}>
                <li>CO₂ avoided with metered, verifiable evidence trails</li>
                <li>Verifier-ready CCTS / BRSR / PAT compliance reports — instantly</li>
                <li>Automated dMRV and ISO 14064 carbon accounting</li>
                <li>25–35% faster compliance cycles</li>
              </ul>
            </div>
          </div>

          {/* HOW IT WORKS — 4 automated levers */}
          <div className={styles.howItWorks}>
            <h3 className={styles.subSectionTitle}>Not Magic. Just Four Automated Levers.</h3>
            <div className={styles.leverGrid}>
              <div className={styles.leverCard}>
                <div className={styles.leverStep}>01</div>
                <h4>See</h4>
                <p>Smart meters and PLCs feed a live Digital Twin — one verified source of truth for the entire facility.</p>
              </div>
              <div className={styles.leverCard}>
                <div className={styles.leverStep}>02</div>
                <h4>Predict</h4>
                <p>AI forecasts peak demand 24 hours ahead, shedding load before you cross the sanctioned penalty limit.</p>
              </div>
              <div className={styles.leverCard}>
                <div className={styles.leverStep}>03</div>
                <h4>Fix</h4>
                <p>Real-time correction of PF surcharges, drifting HVAC setpoints, and costly compressed-air leaks.</p>
              </div>
              <div className={styles.leverCard}>
                <div className={styles.leverStep}>04</div>
                <h4>Shift</h4>
                <p>Automated consumption shifting into off-peak tariff hours, unlocking <strong className={styles.textHighlight}>10–20% cheaper rates</strong>.</p>
              </div>
            </div>
          </div>

          {/* WHY OmniView IQ — comparison */}
          <div className={styles.comparisonBlock}>
            <h3 className={styles.subSectionTitle}>Why OmniView IQ Beats Point Solutions</h3>
            <div className={styles.comparisonTable}>
              <div className={styles.compRow}>
                <div className={styles.compLabel}>Data Source</div>
                <div className={styles.compOld}>❌ Disconnected spreadsheets &amp; manual audits</div>
                <div className={styles.compNew}>✅ One Live Digital Twin</div>
              </div>
              <div className={styles.compRow}>
                <div className={styles.compLabel}>Actionability</div>
                <div className={styles.compOld}>❌ Manual analysis after the breach</div>
                <div className={styles.compNew}>✅ Day-ahead alerts &amp; sub-second curtailment</div>
              </div>
              <div className={styles.compRow}>
                <div className={styles.compLabel}>Value Curve</div>
                <div className={styles.compOld}>❌ Plateaus after the initial fix</div>
                <div className={styles.compNew}>✅ Compounds — every kWh saved mints a credit</div>
              </div>
              <div className={styles.compRow}>
                <div className={styles.compLabel}>Verification</div>
                <div className={styles.compOld}>❌ Slow, expensive periodic consultants</div>
                <div className={styles.compNew}>✅ Automated dMRV blockchain ledger</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: DEPLOYMENT TIERS */}
      <section className={`${styles.productSection} ${styles.bgDark}`} id="pricing" data-key="tiers">
        <div className={styles.sectionContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.headline}>Deployment Tiers</h2>
            <p className={styles.subheadline}>Built modular. Turn on exactly what you need.</p>
          </div>

          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div className={styles.tierName}>Starter</div>
              <p className={styles.tierTarget}>Single facility chasing demand penalties and PF</p>
              <div className={styles.tierIncludes}>
                <strong>Includes:</strong>
                <ul>
                  <li>Core Power Module</li>
                  <li>Command Center</li>
                  <li>PREDICT Engine</li>
                </ul>
              </div>
            </div>
            <div className={`${styles.pricingCard} ${styles.pricingPro}`}>
              <div className={styles.tierBadge}>Most Popular</div>
              <div className={styles.tierName}>Professional</div>
              <p className={styles.tierTarget}>Energy-intensive plant going after whole-system savings</p>
              <div className={styles.tierIncludes}>
                <strong>Includes:</strong>
                <ul>
                  <li>Everything in Starter</li>
                  <li>Thermal & Air Modules</li>
                  <li>OPTIMISE Engine</li>
                  <li>Digital Twin</li>
                </ul>
              </div>
            </div>
            <div className={styles.pricingCard}>
              <div className={styles.tierName}>Enterprise</div>
              <p className={styles.tierTarget}>Multi-site or CCTS/BRSR-obligated groups</p>
              <div className={styles.tierIncludes}>
                <strong>Includes:</strong>
                <ul>
                  <li>Full Hardware Suite</li>
                  <li>MONETISE Module</li>
                  <li>COMPLY Engine</li>
                  <li>Multi-site Rollup</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: FINALE */}
      <section className={`${styles.productSection} ${styles.finaleSection} ${styles.bgGradient}`} id="model-finale" data-key="model-finale">
        <div className={styles.sectionContent}>
          <div className={styles.finaleContent}>
            <h1 className={styles.massiveHeadline}>Don't just manage energy.<br/>Master it.</h1>
            <p className={styles.finaleDesc}>OmniView IQ turns a controllable cost, an invisible waste, and an unclaimed asset into one compounding system of value.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer} id="contact">
        <div className={styles.footerContent}>
          <p>Built by Mightium. Target market: Indian industrial facilities.</p>
          <p>Benchmarks draw on BEE, Central Electricity Authority, state tariff orders (MERC/MSEDCL, BESCOM, GERC), US DOE, LBNL, and peer-reviewed forecasting studies.</p>
        </div>
      </footer>
      
    </div>
  );
}
