'use server';
import { rankHospitalsBySymptoms as rankHospitalsBySymptomsFlow } from '@/ai/flows/rank-hospitals-by-symptoms';
import type { Hospital, RankedHospital } from '@/lib/types';

// Haversine formula to calculate distance between two lat/lng points
const getDistance = (
    loc1: { lat: number; lng: number },
    loc2: { lat: number; lng: number }
  ) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
    const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(loc1.lat * (Math.PI / 180)) *
        Math.cos(loc2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

export async function rankHospitalsBySymptoms(
  symptoms: string,
  hospitals: Hospital[],
  userLocation: { lat: number, lng: number }
): Promise<RankedHospital[]> {
  // 1. Filter hospitals to a reasonable radius (e.g., 50km) and calculate distances
  const nearbyHospitals = hospitals
    .map(hospital => ({
      ...hospital,
      distance: getDistance(userLocation, hospital.coordinates),
    }))
    .filter(hospital => hospital.distance <= 50);

  if (nearbyHospitals.length === 0) {
    return [];
  }

  // 2. Prepare data for the AI flow
  const hospitalsForAI = nearbyHospitals.map(h => ({
    name: h.name,
    specialties: h.specialties,
  }));

  // 3. Call the Genkit flow
  const rankedResults = await rankHospitalsBySymptomsFlow({
    symptoms,
    hospitals: hospitalsForAI,
  });

  // 4. Merge AI ranking with hospital data
  const rankedHospitalsMap = new Map(
    rankedResults.map(r => [r.hospital, { rank: r.rank, reason: r.reason }])
  );

  const mergedHospitals: RankedHospital[] = nearbyHospitals.map(hospital => {
    const ranking = rankedHospitalsMap.get(hospital.name);
    return {
      ...hospital,
      rank: ranking?.rank,
      reason: ranking?.reason,
    };
  });

  // 5. Sort by AI rank
  mergedHospitals.sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));
  
  return mergedHospitals;
}
