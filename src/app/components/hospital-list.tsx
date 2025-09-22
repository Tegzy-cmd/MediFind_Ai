'use client';
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import HospitalCard from './hospital-card';
import type { RankedHospital } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface HospitalListProps {
  hospitals: RankedHospital[];
  onSelectHospital: (hospital: RankedHospital) => void;
  selectedHospital: RankedHospital | null;
  isLoading: boolean;
}

export default function HospitalList({ hospitals, onSelectHospital, selectedHospital, isLoading }: HospitalListProps) {

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-5 w-1/4" />
              </div>
            </Card>
          ))
        ) : hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onSelect={() => onSelectHospital(hospital)}
              isSelected={selectedHospital?.id === hospital.id}
            />
          ))
        ) : (
            <div className="text-center text-muted-foreground py-10">
                <p>No hospitals found for your search.</p>
            </div>
        )}
      </div>
    </ScrollArea>
  );
}
