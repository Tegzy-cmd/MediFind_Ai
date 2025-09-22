'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

import { Card, CardContent } from '@/components/ui/card';
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

const formSchema = z.object({
  symptoms: z.string().min(10, 'Please describe your symptoms in more detail.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SymptomChecker() {
  const [hospitals, setHospitals] = useState<RankedHospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);
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
    setLocationInput('Detecting...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationInput('Your Current Location');
        toast({
          title: 'Location Detected',
          description: 'Your location has been successfully updated.',
        });
      },
      () => {
        setLocationInput('');
        toast({
          variant: 'destructive',
          title: 'Geolocation Error',
          description: 'Unable to retrieve your location. Please enter it manually.',
        });
      }
    );
  }, [toast]);

  useEffect(() => {
    handleGeolocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setIsListVisible(false);
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
    <section className="container py-12 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline">
          Find The Right Hospital, <span className="text-primary">Fast</span>.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Quick access to emergency healthcare facilities with AI-powered recommendations.
        </p>
      </div>

      <Card className="mt-10 mx-auto max-w-4xl shadow-lg">
        <CardContent className="p-6">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <FormLabel htmlFor="location-input">Your Location</FormLabel>
                  <div className="flex gap-2">
                    <div className='relative flex-grow'>
                        <Icons.locate className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="location-input"
                          ref={inputRef}
                          value={locationInput}
                          onChange={(e) => setLocationInput(e.target.value)}
                          placeholder="e.g. Lagos, Nigeria"
                          className='pl-10'
                        />
                    </div>
                    <Button type="button" variant="outline" onClick={handleGeolocation} aria-label="Detect Location">
                      Detect
                    </Button>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AI Symptom Analysis</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'Chest pain' or 'Possible broken arm'"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Analyzing...' : <><Icons.search className="mr-2 h-4 w-4" /> Find Best Facility</>}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isListVisible && userLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-1 h-[60vh] lg:h-auto">
              <HospitalList
                hospitals={hospitals}
                onSelectHospital={handleSelectHospital}
                selectedHospital={selectedHospital}
              />
            </div>
            <div className="lg:col-span-2 rounded-lg overflow-hidden h-[60vh] lg:h-[80vh]">
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
  );
}
