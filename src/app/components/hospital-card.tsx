'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from './icons';
import type { RankedHospital } from '@/lib/types';
import { cn } from '@/lib/utils';

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
      <CardHeader>
        <div className="flex items-start justify-between">
            <CardTitle className="text-base font-semibold">{hospital.name}</CardTitle>
            <Icons.hospital className="h-5 w-5 text-muted-foreground"/>
        </div>
        {hospital.distance && (
          <CardDescription className='pt-1'>{hospital.distance.toFixed(1)} km away</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {hospital.specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="outline">
              {specialty}
            </Badge>
          ))}
          {hospital.specialties.length > 3 && <Badge variant="outline">...</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}
