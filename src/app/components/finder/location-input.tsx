'use client';
import React, { useRef, useEffect, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/app/components/icons';
import { cn } from '@/lib/utils';

interface LocationInputProps {
    onSearch: (address: string) => void;
    onLocate: () => void;
    isLocating: boolean;
    isSearching: boolean;
}

export function LocationInput({ onSearch, onLocate, isLocating, isSearching }: LocationInputProps) {
  const places = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [locationInput, setLocationInput] = useState('');

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const autocompleteInstance = new places.Autocomplete(inputRef.current, {
      fields: ['formatted_address'],
    });
    setAutocomplete(autocompleteInstance);
  }, [places]);

  useEffect(() => {
    if (!autocomplete) return;
    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if(place.formatted_address) {
        setLocationInput(place.formatted_address);
        onSearch(place.formatted_address);
      }
    });
    return () => {
      listener.remove();
    };
  }, [autocomplete, onSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(locationInput);
  }

  return (
    <div className='space-y-4'>
        <div className='space-y-2'>
            <label className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', 'flex items-center gap-2 font-semibold')}>
                <Icons.locate className='h-4 w-4' />
                <span>Your Location</span>
            </label>
            <p className='text-sm text-muted-foreground'>Enter your location to find hospitals near you.</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative w-full">
                <Icons.mapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter your address or city"
                    className="pl-9"
                    disabled={isSearching}
                />
            </div>
            <Button type="submit" disabled={isSearching || !locationInput}>
                {isSearching ? <Icons.sparkles className="animate-spin" /> : <Icons.search />}
            </Button>
        </form>
         <Button variant="outline" onClick={onLocate} disabled={isLocating} className="w-full">
            {isLocating ? (
                <>
                    <Icons.locate className="mr-2 animate-pulse" />
                    Detecting...
                </>
            ) : (
                <>
                    <Icons.locate className="mr-2" />
                    Use Current Location
                </>
            )}
        </Button>
    </div>
  );
}
