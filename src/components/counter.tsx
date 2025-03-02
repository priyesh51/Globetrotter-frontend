"use client";

import { animate } from "framer-motion";
import React, { useEffect, useRef } from "react";

export default function Counter({ number }: { number: number }) {
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const controls = animate(0, number, {
      duration: 1,
      onUpdate(value) {
        if (ref.current) {
          ref.current.textContent = value.toFixed(0);
        }
      },
    });

    return () => controls.stop();
  }, [number]);

  return <p ref={ref} />;
}
