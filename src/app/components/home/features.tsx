import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, ShieldCheck, Ear } from "lucide-react";

const features = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Instant Results",
    description: "Get directions to the nearest appropriate medical facility in seconds.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Verified Facilities",
    description: "All medical centers in our database are verified and updated regularly.",
  },
  {
    icon: <Ear className="h-8 w-8 text-primary" />,
    title: "Emergency Support",
    description: "Direct connection to emergency services with location sharing.",
  },
];

export function Features() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="text-center shadow-lg border-primary/20 border-2 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms`, animationFillMode: 'forwards' }}
            >
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                    {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
