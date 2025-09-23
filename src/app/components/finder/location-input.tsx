
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/app/components/icons';
import { cn } from '@/lib/utils';
import type { Hospital } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface LocationInputProps {
    onSearch: (address: string) => void;
    onLocate: () => void;
    isLocating: boolean;
    isSearching: boolean;
    hospitals: Hospital[];
}

export function LocationInput({ onSearch, onLocate, isLocating, isSearching, hospitals }: LocationInputProps) {
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState<Hospital[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (locationInput) {
      const filtered = hospitals.filter(hospital => 
        hospital.name.toLowerCase().includes(locationInput.toLowerCase()) || 
        hospital.address.toLowerCase().includes(locationInput.toLowerCase())
      ).slice(0, 5); // Limit suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [locationInput, hospitals]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (hospital: Hospital) => {
    setLocationInput(hospital.name);
    setShowSuggestions(false);
    onSearch(hospital.name);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(locationInput);
  };

  return (
    <div className='space-y-4' ref={containerRef}>
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
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                    placeholder="Search hospital name or address"
                    className="pl-9"
                    disabled={isSearching}
                    autoComplete="off"
                />
                {showSuggestions && (
                    <Card className="absolute z-10 w-full mt-1 bg-background shadow-lg max-h-60 overflow-y-auto">
                        <ul>
                            {suggestions.map(hospital => (
                                <li 
                                    key={hospital.id}
                                    className="px-4 py-2 hover:bg-accent cursor-pointer"
                                    onClick={() => handleSuggestionClick(hospital)}
                                >
                                    <p className="font-semibold text-sm">{hospital.name}</p>
                                    <p className="text-xs text-muted-foreground">{hospital.address}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}
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
