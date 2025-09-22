"use client";

import { useState, useEffect, useRef } from 'react';
import { useOnScreen } from '@/hooks/use-on-screen';

interface AnimatedCounterProps {
  endValue: number;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({ endValue, prefix = "", suffix = "" }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const onScreen = useOnScreen(ref);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (onScreen) {
      const duration = 1500;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = endValue / steps;
      let currentCount = 0;

      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= endValue) {
          setCount(endValue);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(currentCount));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [onScreen, endValue]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
