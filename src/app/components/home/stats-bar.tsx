"use client";

import { AnimatedCounter } from "./animated-counter";
import { Hospital, Clock, HeartPulse, Users, Sparkles } from "lucide-react";

interface Stat {
  value?: number;
  suffix?: string;
  prefix?: string;
  name?: string;
  description: string;
  icon: React.ReactNode;
}

const stats: Stat[] = [
  { value: 2450, suffix: "+", description: "Hospitals Listed", icon: <Hospital className="h-8 w-8" /> },
  { name: "3 Mins", description: "Avg. Response Time", icon: <Clock className="h-8 w-8" /> },
  { value: 50000, suffix: "+", description: "Users Helped", icon: <HeartPulse className="h-8 w-8" /> },
  { value: 15000, suffix: "+", description: "AI Recommendations", icon: <Sparkles className="h-8 w-8" /> },
];

export function StatsBar() {
  return (
    <section className="bg-destructive text-destructive-foreground">
      <div className="container py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={`${stat.description}-${index}`} className="flex flex-col items-center gap-2">
              <div className="mb-2 text-destructive-foreground">
                {stat.icon}
              </div>
              <p className="text-4xl md:text-5xl font-bold tracking-tight">
                {stat.name ?? (
                  <AnimatedCounter
                    endValue={stat.value!}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                )}
              </p>
              <p className="text-sm font-medium uppercase tracking-wider text-destructive-foreground/80 mt-2">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
