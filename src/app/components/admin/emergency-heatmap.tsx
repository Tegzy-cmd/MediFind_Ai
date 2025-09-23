
'use client';
import { useState, useEffect } from 'react';
import { Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { getSearchRequests } from '@/lib/firebase/firestore';
import type { Coordinates } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const NIGERIA_CENTER = { lat: 9.0820, lng: 8.6753 };

function HeatmapLayer() {
  const map = useMap();
  const maps = useMapsLibrary('visualization');
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);
  const [points, setPoints] = useState<google.maps.LatLng[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPoints() {
      try {
        const searchRequests: Coordinates[] = await getSearchRequests();
        if (maps) {
          const gmapsPoints = searchRequests.map(p => new maps.LatLng(p.lat, p.lng));
          setPoints(gmapsPoints);
        }
      } catch (e) {
        console.error("Failed to fetch heatmap data:", e);
        setError("Could not load heatmap data.");
      } finally {
        setLoading(false);
      }
    }
    fetchPoints();
  }, [maps]);

  useEffect(() => {
    if (!maps || !map || !points.length) return;

    const newHeatmap = new maps.HeatmapLayer({
      data: points,
      map: map,
    });
    
    newHeatmap.set('radius', 20);
    newHeatmap.set('opacity', 0.8);

    setHeatmap(newHeatmap);

    return () => {
      newHeatmap.setMap(null);
    };

  }, [maps, map, points]);

  if (loading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full w-full bg-destructive/10 text-destructive font-medium p-4">{error}</div>;
  }
  
  if (!points.length) {
    return <div className="flex items-center justify-center h-full w-full bg-muted/50 text-muted-foreground p-4">No search data available to display heatmap.</div>;
  }

  return null;
}

export function EmergencyHeatmap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <p className="text-destructive-foreground bg-destructive p-4 rounded-md">
          Google Maps API key is missing.
        </p>
      </div>
    );
  }

  return (
    <Map
        defaultCenter={NIGERIA_CENTER}
        defaultZoom={5}
        mapId="medifind-heatmap"
        disableDefaultUI={true}
        gestureHandling={'greedy'}
        className='w-full h-full'
    >
      <HeatmapLayer />
    </Map>
  );
}
