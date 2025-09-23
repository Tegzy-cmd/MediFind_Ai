
'use client';

import type { Hospital } from "@/lib/types";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { MapView } from "@/app/components/finder/map-view";
import { HospitalList } from "@/app/components/finder/hospital-list";
import { HospitalDetails } from "@/app/components/finder/hospital-details";
import { rankHospitalsBySymptoms as getRankedHospitals } from "../actions/rank-hospitals";
import { getHospitals } from "@/lib/firebase/firestore";
import { Preloader } from "@/app/components/layout/preloader";
import { Card, CardContent } from "@/components/ui/card";
import { LocationInput } from "@/app/components/finder/location-input";
import { SymptomChecker } from "@/app/components/finder/symptom-checker";
import { Features } from "@/app/components/home/features";
import { EmergencyHotlines } from "@/app/components/home/emergency-hotlines";
import type { RankedHospital, Coordinates } from "@/lib/types";

const haversineDistance = (
  coords1: Coordinates,
  coords2: Coordinates
): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const DEFAULT_LOCATION: Coordinates = { lat: 4.9765, lng: 8.3473 }; // Calabar

type LoadingState =
  | "initializing"
  | "locating"
  | "ranking"
  | "searching"
  | "idle"
  | "error";

export default function Home() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [allHospitals, setAllHospitals] = useState<RankedHospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<RankedHospital | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("initializing");

  const { toast } = useToast();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  const displayedHospitals = useMemo(() => {
    if (!userLocation) return [];
    return allHospitals
      .map((h) => ({
        ...h,
        distance: haversineDistance(userLocation, h.coordinates),
      }))
      .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999) || a.distance - b.distance)
      .slice(0, 20);
  }, [allHospitals, userLocation]);

  useEffect(() => {
    const init = async () => {
      setLoadingState("initializing");
      try {
        const hospitalsData = await getHospitals();
        const hospitalsWithDistance = hospitalsData.map(h => ({...h, distance: 0}));
        setAllHospitals(hospitalsWithDistance);
        setUserLocation(DEFAULT_LOCATION);
      } catch (error) {
        console.error("Failed to fetch hospitals:", error);
        toast({
          title: "Error",
          description: "Could not load hospital data.",
          variant: "destructive",
        });
        setLoadingState("error");
      } finally {
        setTimeout(() => {
          setLoadingState("idle");
        }, 1500);
      }
    };
    init();
  }, [toast]);

  const handleGetAutoLocation = useCallback(() => {
    setLoadingState("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLoadingState("idle");
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location Error",
          description: error.message || "Could not get your location.",
          variant: "destructive",
        });
        setLoadingState("idle");
      },
      { enableHighAccuracy: true }
    );
  }, [toast]);

  const handleSymptomSubmit = useCallback(async (symptoms: string) => {
    if (!symptoms || !userLocation) return;
    setLoadingState("ranking");
    try {
      const currentHospitals: Hospital[] = allHospitals.map(({ rank, reason, distance, ...h }) => h);
      const rankedHospitals = await getRankedHospitals(symptoms, currentHospitals, userLocation);
       
      const hospitalMap = new Map(rankedHospitals.map(h => [h.id, h]));
      setAllHospitals(prev => prev.map(h => hospitalMap.get(h.id) || h));

      toast({
        title: "Success",
        description: "Hospitals ranked based on your symptoms.",
      });
    } catch (error) {
      console.error("Ranking error:", error);
      toast({
        title: "AI Ranking Error",
        description: "Could not rank hospitals at this time.",
        variant: "destructive",
      });
    } finally {
      setLoadingState("idle");
    }
  }, [allHospitals, userLocation, toast]);


  const handleManualLocationSubmit = useCallback(async (location: string) => {
    if (!location) return;
    setLoadingState("searching");
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`);
      const data = await response.json();
      if (data.status === 'OK' && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        setUserLocation({ lat, lng });
      } else {
        toast({
          title: "Geocoding Error",
          description: "Could not find coordinates for the location.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Geocoding API error:", error);
       toast({
        title: "Location Error",
        description: "Failed to fetch location data.",
        variant: "destructive",
      });
    } finally {
      setLoadingState("idle");
    }
  }, [apiKey, toast]);

  const handleSelectHospital = useCallback((hospital: RankedHospital) => {
    setSelectedHospital(hospital);
  }, []);

  if (!apiKey) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p className="text-destructive-foreground bg-destructive p-4 rounded-md">
          Google Maps API key is missing.
        </p>
      </div>
    );
  }

  if (loadingState === "initializing") {
    return <Preloader />;
  }

  return (
      <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
        <main className="flex-1">
          <section className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                 <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-2">Find Nearest Hospitals</h1>
                 <p className="text-lg text-muted-foreground">Quick access to emergency healthcare facilities with AI-powered recommendations.</p>
            </div>

            <Card className="mb-8 shadow-lg bg-card/10 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <LocationInput
                            onSearch={handleManualLocationSubmit}
                            onLocate={handleGetAutoLocation}
                            isLocating={loadingState === 'locating'}
                            isSearching={loadingState === 'searching'}
                        />
                        <SymptomChecker onSymptomSubmit={handleSymptomSubmit} isRanking={loadingState === 'ranking'} />
                     </div>
                </CardContent>
            </Card>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[75vh]">
               <div className="lg:col-span-1 h-full">
                    <HospitalList
                        hospitals={displayedHospitals}
                        onSelectHospital={handleSelectHospital}
                        selectedHospital={selectedHospital}
                        loadingState={loadingState}
                        />
               </div>
               <div className="lg:col-span-2 h-full rounded-lg overflow-hidden">
                 {userLocation && (
                    <Card className="h-full overflow-hidden shadow-lg">
                      <MapView
                        userLocation={userLocation}
                        hospitals={displayedHospitals}
                        selectedHospital={selectedHospital}
                        onSelectHospital={handleSelectHospital}
                      />
                    </Card>
                 )}
               </div>
           </div>
          </section>
          
          <Features />
          <EmergencyHotlines />

        </main>
        {selectedHospital && (
          <HospitalDetails
            hospital={selectedHospital}
            userLocation={userLocation}
            onOpenChange={(open) => !open && setSelectedHospital(null)}
          />
        )}
      </div>
  );
}
