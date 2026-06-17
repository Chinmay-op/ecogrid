import Link from "next/link";
import {
  beyond,
  closing,
  comparison,
  howItWorks,
  modules,
  platformLayers,
  pricingTiers,
  problem,
  scorecard,
  silentWaste,
  site,
  stakeholders,
  threeWins,
} from "@/content/site";

function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <p
        className={`mb-3 text-sm uppercase tracking-[0.2em] ${dark ? "text-white/50" : "text-black/45"}`}
      >
        {eyebrow}
      </p>
      <h2 className={`text-3xl leading-tight md:text-5xl ${dark ? "text-white" : "text-black"}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-white/75" : "text-black/70"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function DataTable({
  headers,
  rows,
  dark = false,
}: {
  headers: string[];
  rows: string[][];
  dark?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className={dark ? "border-b border-white/15" : "border-b border-black/10"}>
            {headers.map((header) => (
              <th
                key={header}
                className={`px-4 py-3 font-medium ${dark ? "text-white/60" : "text-black/50"}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.join("-")}
              className={dark ? "border-b border-white/10" : "border-b border-black/8"}
            >
              {row.map((cell, index) => (
                <td
                  key={`${row[0]}-${index}`}
                  className={`px-4 py-4 align-top ${index === 0 ? "font-medium" : ""} ${dark ? "text-white/85" : "text-black/80"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SiteContent() {
  return (
    <>
      <section id="problem" className="relative z-20 bg-white px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="The Problem" title={problem.title} description={problem.body} />
          <div className="rounded-2xl border border-black/10 bg-[#f7f7f7] p-8 md:p-10">
            <h3 className="mb-3 text-2xl">{problem.highlight.title}</h3>
            <p className="max-w-3xl leading-relaxed text-black/75">{problem.highlight.body}</p>
          </div>
        </div>
      </section>

      <section className="relative z-20 bg-[#ececec] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="The Silent Waste on Your Bill"
            title="Four hidden drains on your operating budget."
          />
          <DataTable
            headers={["Waste Source", "What's Happening"]}
            rows={silentWaste.map((item) => [item.source, item.detail])}
          />
        </div>
      </section>

      <section className="relative z-20 bg-[#111] px-6 py-24 text-white md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="What You Can Recover"
            title="The Three Wins We Deliver"
            dark
          />
          <div className="grid gap-6 md:grid-cols-3">
            {threeWins.map((win) => (
              <article key={win.result} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-2xl leading-snug text-white">{win.result}</h3>
                <p className="leading-relaxed text-white/75">{win.meaning}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-20 bg-white px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="How It Works"
            title="Not Magic. Just Four Automated Levers."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {howItWorks.map((item) => (
              <article key={item.step} className="rounded-2xl border border-black/10 p-6">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-black/45">{item.step}</p>
                <h3 className="mb-3 text-2xl">{item.title}</h3>
                <p className="leading-relaxed text-black/70">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="relative z-20 bg-[#ececec] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="The Platform"
            title="Physical Reality Goes In. Financial Value Comes Out."
            description="OmniView IQ is a single platform that carries your facility from a physical kilowatt to a tradeable carbon asset — end to end, in one pane of glass."
          />
          <DataTable
            headers={["Layer", "What Happens"]}
            rows={platformLayers.map((layer) => [layer.layer, layer.detail])}
          />
        </div>
      </section>

      <section className="relative z-20 bg-white px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Why OmniView IQ"
            title="Why OmniView IQ Beats Point Solutions"
          />
          <DataTable
            headers={["", "Point Solutions", "OmniView IQ Ecosystem"]}
            rows={comparison.map((row) => [row.aspect, row.point, row.omni])}
          />
        </div>
      </section>

      <section id="modules" className="relative z-20 bg-[#111] px-6 py-24 text-white md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="The Three Modules"
            title="Built Modular. Turn On Exactly What You Need."
            dark
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {modules.map((module) => (
              <article key={module.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-3 text-2xl tracking-wide">{module.name}</h3>
                <p className="mb-4 leading-relaxed text-white/75">{module.body}</p>
                <p className="mb-2 text-white">→ {module.outcome}</p>
                <p className="text-sm text-white/55">({module.tier})</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/75">
            <strong className="font-medium text-white">Brownfield-friendly.</strong> Integrates
            seamlessly with your existing meters and PLCs. No rip-and-replace required.
          </p>
        </div>
      </section>

      <section className="relative z-20 bg-white px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="One Dashboard"
            title="Four Distinct Wins."
          />
          <DataTable
            headers={["Stakeholder", "What They See"]}
            rows={stakeholders.map((item) => [item.role, item.view])}
          />
        </div>
      </section>

      <section className="relative z-20 bg-[#ececec] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="The Numbers" title="The Benchmarked Scorecard" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl">Financial Impact</h3>
              <ul className="space-y-3 text-black/75">
                {scorecard.financial.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-2xl">Time & Operational Impact</h3>
              <ul className="space-y-3 text-black/75">
                {scorecard.operational.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="relative z-20 bg-[#111] px-6 py-24 text-white md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Pricing Tiers" title="Start where your facility needs it most." dark />
          <DataTable
            dark
            headers={["Tier", "Best For", "What's Included"]}
            rows={pricingTiers.map((tier) => [tier.tier, tier.bestFor, tier.included])}
          />
        </div>
      </section>

      <section className="relative z-20 bg-white px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Beyond Money and Time"
            title="Mastering Energy Changes the Nature of the Facility."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {beyond.map((item) => (
              <article key={item.title} className="rounded-2xl border border-black/10 p-6">
                <h3 className="mb-3 text-2xl">{item.title}</h3>
                <p className="leading-relaxed text-black/70">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative z-20 bg-[#111] px-6 py-24 text-white md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <blockquote className="mb-6 text-3xl leading-tight md:text-5xl">
            {closing.headline}
          </blockquote>
          <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-white/75">
            {closing.body}
          </p>
          <Link
            href="#contact"
            className="inline-flex rounded-full bg-white px-8 py-3 text-sm font-medium text-black transition hover:bg-[#ececec]"
          >
            {site.cta}
          </Link>
          <p className="mt-10 text-sm text-white/45">{site.credit}</p>
        </div>
      </section>
    </>
  );
}
