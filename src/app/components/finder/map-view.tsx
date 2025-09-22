'use client';

import React, { useEffect, useRef } from 'react';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import type { RankedHospital, Coordinates } from '@/lib/types';
import { CustomHospitalMarker, UserMarker } from '../icons';

interface MapViewProps {
  hospitals: RankedHospital[];
  userLocation: Coordinates;
  selectedHospital: RankedHospital | null;
  onSelectHospital: (hospital: RankedHospital) => void;
}

export function MapView({ hospitals, userLocation, selectedHospital, onSelectHospital }: MapViewProps) {
    const mapRef = useRef<google.maps.Map | null>(null);

    useEffect(() => {
        if(mapRef.current && selectedHospital) {
            mapRef.current.panTo(selectedHospital.coordinates);
        } else if (mapRef.current && userLocation) {
            mapRef.current.panTo(userLocation)
        }
    }, [selectedHospital, userLocation]);

  return (
    <Map
        ref={mapRef}
        defaultCenter={userLocation}
        defaultZoom={12}
        mapId="medifind-map"
        disableDefaultUI={true}
        gestureHandling={'greedy'}
        className='w-full h-full'
    >
        <AdvancedMarker position={userLocation}>
            <UserMarker />
        </AdvancedMarker>

        {hospitals.map((hospital) => (
            <AdvancedMarker
                key={hospital.id}
                position={hospital.coordinates}
                onClick={() => onSelectHospital(hospital)}
            >
                {selectedHospital?.id === hospital.id ? (
                    <CustomHospitalMarker />
                ) : (
                    <Pin
                        background={'hsl(var(--secondary))'}
                        borderColor={'hsl(var(--border))'}
                        glyphColor={'hsl(var(--secondary-foreground))'}
                    />
                )}
            </AdvancedMarker>
        ))}
    </Map>
  );
}
