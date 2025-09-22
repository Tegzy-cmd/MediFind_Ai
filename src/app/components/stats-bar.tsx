'use client';
import { useRef, useEffect, useState } from 'react';
import { useOnScreen } from '@/hooks/use-on-screen';
import { Icons } from './icons';

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

  return <span className="text-4xl md:text-5xl font-bold text-destructive-foreground">{count.toLocaleString()}+</span>;
}

const stats = [
    { label: "HOSPITALS LISTED", value: 2450, icon: <Icons.hospital className="h-8 w-8 mx-auto mb-2" /> },
    { label: "AVG. RESPONSE TIME", value: 3, unit: "Mins", icon: <Icons.clock className="h-8 w-8 mx-auto mb-2" /> },
    { label: "USERS HELPED", value: 50000, icon: <Icons.heart className="h-8 w-8 mx-auto mb-2" /> },
    { label: "AI RECOMMENDATIONS", value: 15000, icon: <Icons.sparkles className="h-8 w-8 mx-auto mb-2" /> },
]

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);

  return (
    <section ref={ref} className="bg-destructive text-destructive-foreground">
      <div className="container py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {stats.map(stat => (
                <div key={stat.label}>
                    {stat.icon}
                    <div className="text-4xl md:text-5xl font-bold text-destructive-foreground">
                      {onScreen ? <AnimatedCounter value={stat.value} /> : '0+'}
                      {stat.unit && <span className="text-3xl ml-1">{stat.unit}</span>}
                    </div>
                    <p className="text-sm text-destructive-foreground/80 mt-2 tracking-widest">{stat.label}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
