'use server';
import { rankHospitalsBySymptoms as rankHospitalsBySymptomsFlow } from '@/ai/flows/rank-hospitals-by-symptoms';
import type { Hospital, RankedHospital, Coordinates } from '@/lib/types';

// Haversine formula to calculate distance between two lat/lng points
const getDistance = (
    loc1: Coordinates,
    loc2: Coordinates
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
  userLocation: Coordinates
): Promise<RankedHospital[]> {
  // 1. Calculate distances for all hospitals
  const allHospitalsWithDistance = hospitals
    .map(hospital => ({
      ...hospital,
      distance: getDistance(userLocation, hospital.coordinates),
    }));

  // 2. Prepare data for the AI flow (use all hospitals for ranking)
  const hospitalsForAI = allHospitalsWithDistance.map(h => ({
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

  const mergedHospitals: RankedHospital[] = allHospitalsWithDistance.map(hospital => {
    const ranking = rankedHospitalsMap.get(hospital.name);
    return {
      ...hospital,
      rank: ranking?.rank,
      reason: ranking?.reason,
    };
  });

  // 5. Sort by AI rank, then by distance
  mergedHospitals.sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity) || a.distance - b.distance);
  
  return mergedHospitals;
}
