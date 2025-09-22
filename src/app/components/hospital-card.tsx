'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from './icons';
import type { RankedHospital } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface HospitalCardProps {
  hospital: RankedHospital;
  onSelect: () => void;
  isSelected: boolean;
}

export default function HospitalCard({ hospital, onSelect, isSelected }: HospitalCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer hover:border-primary transition-colors',
        isSelected && 'border-primary ring-2 ring-primary'
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        {hospital.rank && (
          <Badge variant="default" className="w-fit bg-primary text-primary-foreground mb-2">
            <Icons.sparkles className="h-3 w-3 mr-1.5" />
            AI Pick #{hospital.rank}
          </Badge>
        )}
        <CardTitle className="text-lg">{hospital.name}</CardTitle>
        {hospital.distance && (
          <CardDescription>{hospital.distance.toFixed(1)} km away</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        {hospital.reason && (
           <>
            <Separator />
            <p className="text-sm text-muted-foreground italic">
                &quot;{hospital.reason}&quot;
            </p>
           </>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          {hospital.specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
          {hospital.specialties.length > 3 && <Badge variant="secondary">...</Badge>}
        </div>
      </CardFooter>
    </Card>
  );
}
