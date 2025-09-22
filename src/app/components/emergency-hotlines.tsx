import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "./icons";

const hotlines = [
    { name: "National Emergency Number", number: "911", tel: "911" },
    { name: "Poison Control Center", number: "1-800-222-1222", tel: "18002221222" },
    { name: "Mental Health Crisis Line", number: "988", tel: "988" },
]

export function EmergencyHotlines() {
    return (
        <section className="bg-destructive text-destructive-foreground">
            <div className="container py-12 md:py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Emergency Hotlines</h2>
                    <p className="mt-4 text-lg text-destructive-foreground/80">
                        For immediate assistance, please use these critical contact numbers.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {hotlines.map(hotline => (
                         <Card key={hotline.name} className="bg-destructive-foreground/10 border-destructive-foreground/20">
                            <CardContent className="p-6 text-center flex flex-col items-center justify-center">
                                <h3 className="font-semibold">{hotline.name}</h3>
                                <p className="text-3xl font-bold my-4">{hotline.number}</p>
                                <Button asChild variant="secondary" className="bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90">
                                    <a href={`tel:${hotline.tel}`}>
                                        <Icons.phoneCall className="mr-2 h-4 w-4" /> Call Now
                                    </a>
                                </Button>
                            </CardContent>
                         </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
