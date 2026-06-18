"use client";

import { LAYERS } from "@/content/ecogridData";
import styles from "./LayersScroll.module.css";

function Card({ layer }: { layer: any }) {
  /* Split body text into individual bullet points by sentence */
  const bullets = (layer.body as string)
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=\.)\s+/)
    .filter((s: string) => s.trim().length > 0);

  return (
    <div className={styles.card} data-n={layer.n}>
      <div className={styles.index}>
        <span className={styles.swatch} style={{ backgroundColor: layer.hex }} />
        LAYER {layer.n} — {layer.name.split("· ")[1]}
      </div>
      <div className={styles.sub}>{layer.sub}</div>
      <h2 className={styles.title}>{layer.title}</h2>
      <ul className={styles.bodyList}>
        {bullets.map((point: string, i: number) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
      <ul className={styles.specs}>
        {layer.specs.map(([k, v]: [string, string]) => (
          <li key={k}>
            {k}
            <span>{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LayersScroll() {
  return (
    <div className={styles.container} id="platform">
      {/* The 3D model choreography transitions seamlessly from the hero slide */}

      {LAYERS.map((l) => (
        <section
          key={l.key}
          className={`${styles.chapter} ${l.side === "right" ? styles.cardright : styles.cardleft}`}
          id={l.id}
          data-key={l.key}
          data-snap="true"
        >
          <div className={styles.pin}>
            <Card layer={l} />
          </div>
        </section>
      ))}

    </div>
  );
}
