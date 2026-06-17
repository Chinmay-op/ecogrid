"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import styles from "./HeroScroll.module.css";

gsap.registerPlugin(ScrollTrigger);

export function HeroScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const grayRef = useRef<HTMLDivElement>(null);
  const titlePrimaryRef = useRef<HTMLHeadingElement>(null);
  const titleSecondaryRef = useRef<HTMLHeadingElement>(null);
  const servicesRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    const gray = grayRef.current;
    const titlePrimary = titlePrimaryRef.current;
    const titleSecondary = titleSecondaryRef.current;
    const services = servicesRef.current;

    if (!wrapper || !section || !gray || !titlePrimary || !titleSecondary || !services) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      tl.to(
          gray,
          { opacity: 0, ease: "none", duration: 0.5 },
          0,
        )
        .to(
          titlePrimary,
          { opacity: 0, ease: "none", duration: 0.5 },
          0,
        )
        .fromTo(
          titleSecondary,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.5 },
          0.5,
        )
        .fromTo(
          services,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, ease: "none", duration: 0.5 },
          0.5,
        );
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className={styles.heroWrapper}>
      <div className={`${styles.snapPoint} ${styles.snapPoint1}`} data-snap="true" />
      <div className={`${styles.snapPoint} ${styles.snapPoint2}`} data-snap="true" />

      <section ref={sectionRef} className={styles.heroSticky} aria-label="Hero">
        <div ref={grayRef} className={styles.heroGray} aria-hidden />

        <div className={styles.heroContent}>
          <div className={styles.titleStack}>
            <h1 ref={titlePrimaryRef} className={styles.heroTitle}>
              <span>OmniView IQ</span>
              <span>Energy · Compliance · Carbon</span>
            </h1>
            <h1 ref={titleSecondaryRef} className={`${styles.heroTitle} ${styles.heroTitleAlt}`}>
              <span>See your plant</span>
              <span>in five layers.</span>
            </h1>
          </div>

          <nav ref={servicesRef} className={styles.heroServices} aria-label="Modules">
            {site.heroModules.map((module) => (
              <span key={module}>{module}</span>
            ))}
          </nav>
        </div>
      </section>
    </div>
  );
}


