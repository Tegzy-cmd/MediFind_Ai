import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/app/components/icons";

const hotlines = [
    { name: "General Emergency", number: "911", tel: "911", icon: <Icons.alertTriangle className="h-8 w-8 mb-4"/> },
    { name: "Poison Control", number: "1-800-222-1222", tel: "18002221222", icon: <Icons.biohazard className="h-8 w-8 mb-4"/> },
    { name: "Mental Health", number: "988", tel: "988", icon: <Icons.brainCircuit className="h-8 w-8 mb-4"/> },
    { name: "Fire Department", number: "911", tel: "911", icon: <Icons.fireExtinguisher className="h-8 w-8 mb-4"/> },
]

export function EmergencyHotlines() {
    return (
        <section className="bg-destructive text-destructive-foreground">
            <div className="container py-12 md:py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Emergency Hotlines</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-12">
                    {hotlines.map(hotline => (
                         <Card key={hotline.name} className="bg-destructive-foreground/10 border-destructive-foreground/20">
                            <CardContent className="p-6 text-center flex flex-col items-center justify-center">
                                <a href={`tel:${hotline.tel}`}>
                                    {hotline.icon}
                                    <h3 className="font-semibold text-xl">{hotline.number}</h3>
                                    <p className="text-sm text-destructive-foreground/80 mt-1">{hotline.name}</p>
                                </a>
                            </CardContent>
                         </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
