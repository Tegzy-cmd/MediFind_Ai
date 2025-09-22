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
}

export default function HospitalList({ hospitals, onSelectHospital, selectedHospital }: HospitalListProps) {

  return (
    <ScrollArea className="h-full">
      <div className="p-1 space-y-4">
        {hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onSelect={() => onSelectHospital(hospital)}
              isSelected={selectedHospital?.id === hospital.id}
            />
          ))
        ) : (
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
        )}
      </div>
    </ScrollArea>
  );
}
