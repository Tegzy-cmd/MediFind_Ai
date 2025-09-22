
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Icons } from './icons';
import { getHospitals } from '@/lib/firebase/firestore';
import { rankHospitalsBySymptoms } from '@/app/actions/rank-hospitals';
import type { RankedHospital } from '@/lib/types';
import HospitalList from './hospital-list';
import MapView from './map-view';
import HospitalDetailsSheet from './hospital-details-sheet';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  symptoms: z.string().min(10, 'Please describe your symptoms in more detail.'),
});

type FormValues = z.infer<typeof formSchema>;

const specialties = ["Orthopedics", "General Surgery", "Dentistry"];

export default function SymptomChecker() {
  const [hospitals, setHospitals] = useState<RankedHospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListVisible, setIsListVisible] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState<RankedHospital | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  const places = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [locationInput, setLocationInput] = useState('');

  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation Error',
        description: 'Geolocation is not supported by your browser.',
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        toast({
          variant: 'destructive',
          title: 'Geolocation Error',
          description: 'Could not get your location. Please enter it manually or enable location services.',
        });
        // Set a default location if geolocation fails
        setUserLocation({ lat: 6.5244, lng: 3.3792 }); // Default to Lagos, Nigeria
      }
    );
  }, [toast]);


  useEffect(() => {
    handleGeolocation();
  }, [handleGeolocation]);

  const fetchInitialHospitals = useCallback(async () => {
    if (!userLocation) return;
    setIsLoading(true);
    try {
      const allHospitals = await getHospitals();
       const uniqueHospitals = Array.from(new Map(allHospitals.map(h => [h.name, h])).values());

      const ranked = await rankHospitalsBySymptoms("Initial load", uniqueHospitals, userLocation);
      setHospitals(ranked);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch hospitals.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, toast]);

  useEffect(() => {
    if(userLocation && hospitals.length === 0){
        fetchInitialHospitals();
    }
  }, [userLocation, hospitals, fetchInitialHospitals]);

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const autocompleteInstance = new places.Autocomplete(inputRef.current, {
      fields: ['geometry', 'name', 'formatted_address'],
    });
    setAutocomplete(autocompleteInstance);
  }, [places]);

  useEffect(() => {
    if (!autocomplete) return;
    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setUserLocation({ lat, lng });
        setLocationInput(place.formatted_address || place.name || '');
      } else {
        toast({
          variant: 'destructive',
          title: 'Location not found',
          description: 'Could not find the selected location. Please try again.',
        });
      }
    });
    return () => {
      listener.remove();
    };
  }, [autocomplete, toast]);

  const onSubmit = async (data: FormValues) => {
    if (!userLocation) {
      toast({
        variant: 'destructive',
        title: 'Location Required',
        description: 'Please enable, detect, or enter your location.',
      });
      return;
    }
    setIsLoading(true);
    setSelectedHospital(null);
    try {
      const allHospitals = await getHospitals();
      const uniqueHospitals = Array.from(new Map(allHospitals.map(h => [h.name, h])).values());
      const ranked = await rankHospitalsBySymptoms(data.symptoms, uniqueHospitals, userLocation);
      setHospitals(ranked);
      setIsListVisible(true);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI Analysis Failed',
        description: 'Could not rank hospitals. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHospital = (hospital: RankedHospital | null) => {
    setSelectedHospital(hospital);
  };

  return (
    <>
      <section className="container pt-8 md:pt-12">
          <AnimatePresence>
            {isListVisible && userLocation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-1 h-[70vh] lg:h-[calc(100vh-12rem)]">
                   <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>MediFind</CardTitle>
                             <div className="flex flex-wrap gap-2 pt-2">
                                {specialties.map((spec) => (
                                    <Badge key={spec} variant="outline">{spec}</Badge>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-grow">
                             <HospitalList
                                hospitals={hospitals}
                                onSelectHospital={handleSelectHospital}
                                selectedHospital={selectedHospital}
                              />
                        </CardContent>
                   </Card>
                </div>
                <div className="lg:col-span-2 rounded-lg overflow-hidden h-[70vh] lg:h-[calc(100vh-12rem)]">
                  <MapView
                    hospitals={hospitals}
                    userLocation={userLocation}
                    selectedHospital={selectedHospital}
                    onSelectHospital={handleSelectHospital}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <HospitalDetailsSheet
            hospital={selectedHospital}
            onOpenChange={(isOpen) => !isOpen && setSelectedHospital(null)}
          />
      </section>
    </>
  );
}
