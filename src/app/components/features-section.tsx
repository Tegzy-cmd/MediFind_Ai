import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Icons } from "./icons";

const features = [
    {
        icon: <Icons.sparkles className="h-8 w-8 text-primary" />,
        title: "AI-Powered Rankings",
        description: "Our advanced AI analyzes your symptoms to recommend the most suitable hospital, considering their specialties and services.",
    },
    {
        icon: <Icons.shieldCheck className="h-8 w-8 text-primary" />,
        title: "Verified Facilities",
        description: "We list only verified hospitals and clinics, ensuring you get access to reliable and high-quality medical care.",
    },
    {
        icon: <Icons.navigation className="h-8 w-8 text-primary" />,
        title: "Instant Results & Directions",
        description: "Get instant hospital recommendations and one-click directions, saving critical time in an emergency.",
    }
]

export function FeaturesSection() {
    return (
        <section className="container py-12 md:py-24">
            <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Why Choose MediFind AI?</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    In an emergency, every second counts. We provide the clarity you need to make the best decision, fast.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {features.map(feature => (
                    <Card key={feature.title}>
                        <CardHeader className="items-center text-center">
                            {feature.icon}
                            <CardTitle className="mt-4">{feature.title}</CardTitle>
                            <CardDescription className="mt-2">
                                {feature.description}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </section>
    );
}
