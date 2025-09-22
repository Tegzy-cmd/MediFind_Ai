'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from './icons';
import HospitalCard from './hospital-card';
import type { RankedHospital } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HospitalListProps {
  hospitals: RankedHospital[];
  onSelectHospital: (hospital: RankedHospital) => void;
  selectedHospital: RankedHospital | null;
}

export default function HospitalList({ hospitals, onSelectHospital, selectedHospital }: HospitalListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.specialties.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Nearby Hospitals</CardTitle>
        <div className="relative mt-2">
          <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by name or specialty..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <ScrollArea className="h-[calc(80vh-150px)] lg:h-[calc(80vh-150px)]">
          <div className="p-6 pt-0 space-y-4">
            {filteredHospitals.length > 0 ? (
              filteredHospitals.map((hospital) => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  onSelect={() => onSelectHospital(hospital)}
                  isSelected={selectedHospital?.id === hospital.id}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hospitals match your search.
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
