"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;

    function animate(timestamp: number) {
      if (startTime.current === null) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // easing "ease-out" — pornește rapid, încetinește spre final
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(target * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}