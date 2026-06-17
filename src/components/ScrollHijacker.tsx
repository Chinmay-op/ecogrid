"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(Observer, ScrollToPlugin);

export function ScrollHijacker() {
  const isAnimating = useRef(false);
  const currentSnapIndex = useRef(0);
  const observerRef = useRef<Observer | null>(null);
  const isHijacked = useRef(true);

  useEffect(() => {
    // Disable CSS scroll snap while hijacking is active
    document.documentElement.style.scrollSnapType = "none";

    const timeout = setTimeout(() => {
      const snapPoints = Array.from(document.querySelectorAll('[data-snap="true"]')) as HTMLElement[];
      if (snapPoints.length === 0) return;

      const getAbsoluteTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

      // Determine initial index based on scroll position
      let closestIdx = 0;
      let minDiff = Infinity;
      
      snapPoints.forEach((point, idx) => {
        const diff = Math.abs(window.scrollY - getAbsoluteTop(point));
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      currentSnapIndex.current = closestIdx;

      // If we are below the last snap point, we shouldn't lock scroll
      if (closestIdx === snapPoints.length - 1 && window.scrollY > getAbsoluteTop(snapPoints[closestIdx]) + 10) {
        isHijacked.current = false;
      } else {
        // Lock scroll position
        gsap.set(window, { scrollTo: getAbsoluteTop(snapPoints[closestIdx]) });
      }

      // Track the last wheel event time to detect trackpad momentum
      let lastWheelTime = Date.now();
      const updateWheelTime = () => { lastWheelTime = Date.now(); };
      window.addEventListener('wheel', updateWheelTime, { passive: true });
      window.addEventListener('touchmove', updateWheelTime, { passive: true });

      observerRef.current = Observer.create({
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onDown: () => {
          if (!isHijacked.current) return;
          gotoSection(currentSnapIndex.current - 1);
        },
        onUp: () => {
          if (!isHijacked.current) return;
          // If we are at the last point and scrolling down, release the hijacker
          if (currentSnapIndex.current === snapPoints.length - 1) {
            releaseHijacker();
            window.scrollBy({ top: 20, behavior: 'smooth' });
            return;
          }
          gotoSection(currentSnapIndex.current + 1);
        },
        tolerance: 10,
        preventDefault: true,
      });

      if (!isHijacked.current) {
        observerRef.current.disable();
      }

      function releaseHijacker() {
        isHijacked.current = false;
        if (observerRef.current) observerRef.current.disable();
      }

      function engageHijacker() {
        isHijacked.current = true;
        if (observerRef.current) observerRef.current.enable();
        gotoSection(snapPoints.length - 1);
      }

      const onNativeScroll = () => {
        if (isHijacked.current) return;
        const lastTop = getAbsoluteTop(snapPoints[snapPoints.length - 1]);
        if (window.scrollY < lastTop - 5) {
          engageHijacker();
        }
      };

      window.addEventListener('scroll', onNativeScroll, { passive: true });

      function gotoSection(index: number) {
        if (isAnimating.current || index < 0 || index >= snapPoints.length) return;
        
        isAnimating.current = true;
        currentSnapIndex.current = index;
        
        const target = getAbsoluteTop(snapPoints[index]);
        
        gsap.to(window, {
          scrollTo: target,
          duration: 1.2,
          ease: "power3.inOut",
          onComplete: () => {
            // Wait until trackpad momentum has completely stopped
            const checkMomentum = () => {
              if (Date.now() - lastWheelTime > 150) {
                isAnimating.current = false;
              } else {
                setTimeout(checkMomentum, 50);
              }
            };
            checkMomentum();
          }
        });
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      Observer.getAll().forEach(o => o.kill());
      document.documentElement.style.scrollSnapType = "";
      window.removeEventListener('wheel', updateWheelTime);
      window.removeEventListener('touchmove', updateWheelTime);
    };
  }, []);

  return null;
}
