'use client';
import { useRef, useEffect, useState } from 'react';
import { useOnScreen } from '@/hooks/use-on-screen';

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    const duration = 1500; // ms
    const stepTime = 20; // ms
    const steps = duration / stepTime;
    const increment = value / steps;
    
    let currentCount = 0;
    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(currentCount));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span className="text-4xl md:text-5xl font-bold text-primary">{count.toLocaleString()}+</span>;
}

const stats = [
    { label: "Hospitals Listed", value: 1250 },
    { label: "Users Helped Daily", value: 15000 },
    { label: "AI Analyses Ran", value: 75000 },
]

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

  return (
    <section ref={ref} className="bg-secondary">
      <div className="container py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map(stat => (
                <div key={stat.label}>
                    {onScreen ? <AnimatedCounter value={stat.value} /> : <span className="text-4xl md:text-5xl font-bold text-primary">0+</span>}
                    <p className="text-lg text-muted-foreground mt-2">{stat.label}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
