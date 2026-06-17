"use client";

import { useEffect, useRef } from "react";
import { initStage } from "@/three/stage";

export function StageCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const cleanup = initStage(ref.current);
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  return (
    <canvas
      id="stage"
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 20, // Sit on top of the solid-background roadmap sections
        pointerEvents: "none",
      }}
    />
  );
}
