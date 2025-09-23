'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icons } from '../icons';
import type { RankedHospital, Coordinates } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HospitalDetailsSheetProps {
  hospital: RankedHospital | null;
  onOpenChange: (isOpen: boolean) => void;
  userLocation: Coordinates | null;
}

export function HospitalDetails({ hospital, onOpenChange, userLocation }: HospitalDetailsSheetProps) {
  const isOpen = !!hospital;

  const directionsUrl = userLocation 
    ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital?.name}, ${hospital?.address}`
    : `https://www.google.com/maps/dir/?api=1&destination=${hospital?.name}, ${hospital?.address}`;


  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-[90vw] p-0">
        {hospital && (
          <>
            <SheetHeader className="p-6">
                {hospital.rank && (
                    <Badge variant="default" className="w-fit bg-primary text-primary-foreground mb-2">
                        <Icons.sparkles className="h-3 w-3 mr-1.5" />
                        AI Pick #{hospital.rank}
                    </Badge>
                )}
              <SheetTitle className="text-2xl">{hospital.name}</SheetTitle>
              <SheetDescription>
                {hospital.address}
                {hospital.distance != null && <span className="mx-2">•</span>}
                {hospital.distance != null && `${hospital.distance.toFixed(1)} km away`}
              </SheetDescription>
            </SheetHeader>
            <div className="flex gap-2 p-6 pt-0">
              <Button asChild className="w-full">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                    <Icons.navigation className="mr-2 h-4 w-4" /> Get Directions
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href={`tel:${hospital.contact}`}>
                    <Icons.phone className="mr-2 h-4 w-4" /> Call Now
                </a>
              </Button>
            </div>
            <Separator />
            <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-6 space-y-6">
                {hospital.reason && (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">AI Recommendation</h3>
                        <p className="text-sm text-muted-foreground italic">&quot;{hospital.reason}&quot;</p>
                    </div>
                )}
                <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                        {hospital.specialties.map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Services</h3>
                    <div className="flex flex-wrap gap-2">
                        {hospital.services.map((item) => <Badge key={item} variant="outline">{item}</Badge>)}
                    </div>
                </div>
            </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
