import { Phone, HeartPulse, Brain, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const hotlines = [
  { icon: <Phone className="h-8 w-8" />, number: "911", service: "General Emergency" },
  { icon: <HeartPulse className="h-8 w-8" />, number: "1-800-222-1222", service: "Poison Control" },
  { icon: <Brain className="h-8 w-8" />, number: "988", service: "Mental Health" },
  { icon: <Flame className="h-8 w-8" />, number: "911", service: "Fire Department" },
];

export function EmergencyHotlines() {
  return (
    <section className="bg-destructive text-destructive-foreground py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8 font-headline">Emergency Hotlines</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotlines.map((hotline, index) => (
            <a key={index} href={`tel:${hotline.number.replace(/-/g, "")}`} className="group">
              <Card className="bg-destructive/90 text-destructive-foreground group-hover:bg-background group-hover:text-foreground transition-all duration-300 shadow-xl border-destructive-foreground/20 group-hover:-translate-y-2">
                <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                  {hotline.icon}
                  <p className="text-2xl font-bold tracking-wider">{hotline.number}</p>
                  <p className="text-sm font-medium">{hotline.service}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
