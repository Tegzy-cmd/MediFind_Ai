'use client';
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '../icons';
import HospitalCard from '@/app/components/hospital-card';
import type { RankedHospital } from '@/lib/types';

interface HospitalListProps {
  hospitals: RankedHospital[];
  onSelectHospital: (hospital: RankedHospital) => void;
  selectedHospital: RankedHospital | null;
  loadingState: "initializing" | "locating" | "ranking" | "searching" | "idle" | "error";
}

export function HospitalList({ hospitals, onSelectHospital, selectedHospital, loadingState }: HospitalListProps) {
  const isLoading = loadingState === 'initializing' || loadingState === 'ranking' || loadingState === 'searching';
  return (
    <Card className="h-full flex flex-col">
        <CardHeader className='pb-4'>
            <div className='flex items-center gap-2'>
                <Icons.heart className='h-5 w-5 text-primary' />
                <h3 className="font-semibold text-lg">Nearby Hospitals</h3>
            </div>
        </CardHeader>
        <ScrollArea className="h-full">
        <div className="p-4 pt-0 space-y-3">
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
    </Card>
  );
}
