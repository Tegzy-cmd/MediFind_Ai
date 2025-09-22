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
      <CardHeader className='p-4'>
        <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-base font-semibold leading-tight">{hospital.name}</CardTitle>
            {hospital.rank ? (
                <Badge variant="default" className="flex-shrink-0 bg-primary text-primary-foreground">
                    <Icons.sparkles className="h-3 w-3 mr-1" />
                    #{hospital.rank}
                </Badge>
            ) : (
                <Icons.hospital className="h-5 w-5 text-muted-foreground flex-shrink-0"/>
            )}
        </div>
        {hospital.distance != null && (
          <CardDescription className='pt-1 text-xs'>{hospital.distance.toFixed(1)} km away</CardDescription>
        )}
      </CardHeader>
      <CardContent className='p-4 pt-0'>
        {hospital.reason && <p className='text-xs text-muted-foreground italic mb-2 line-clamp-2'>&quot;{hospital.reason}&quot;</p>}
        <div className="flex flex-wrap gap-1.5">
          {hospital.specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="secondary" className='text-xs'>
              {specialty}
            </Badge>
          ))}
          {hospital.specialties.length > 3 && <Badge variant="outline" className='text-xs'>...</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}
