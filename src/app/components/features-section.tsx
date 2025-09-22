import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Icons } from "./icons";

const features = [
    {
        icon: <Icons.navigation className="h-8 w-8 text-primary" />,
        title: "Instant Results",
        description: "Get directions to the nearest appropriate medical facility in seconds.",
    },
    {
        icon: <Icons.shieldCheck className="h-8 w-8 text-primary" />,
        title: "Verified Facilities",
        description: "All medical centers in our database are verified and updated regularly.",
    },
    {
        icon: <Icons.phoneCall className="h-8 w-8 text-primary" />,
        title: "Emergency Support",
        description: "Direct connection to emergency services with location sharing.",
    }
]

export function FeaturesSection() {
    return (
        <section className="container py-12 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {features.map(feature => (
                    <Card key={feature.title} className="bg-secondary">
                        <CardHeader className="items-center text-center p-8">
                            {feature.icon}
                            <CardTitle className="mt-4">{feature.title}</CardTitle>
                            <CardDescription className="mt-2 text-base">
                                {feature.description}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </section>
    );
}
