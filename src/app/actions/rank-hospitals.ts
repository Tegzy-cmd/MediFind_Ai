
'use server';
import { rankHospitalsBySymptoms as rankHospitalsBySymptomsFlow } from '@/ai/flows/rank-hospitals-by-symptoms';
import type { Hospital, RankedHospital, Coordinates } from '@/lib/types';
import { haversineDistance } from '@/lib/utils';

export async function rankHospitalsBySymptoms(
  symptoms: string,
  hospitals: Hospital[],
  userLocation: Coordinates
): Promise<RankedHospital[]> {
  // 1. Prepare data for the AI flow (use all hospitals for ranking)
  const hospitalsForAI = hospitals.map(h => ({
    name: h.name,
    specialties: h.specialties,
  }));

  // 2. Call the Genkit flow
  const rankedResults = await rankHospitalsBySymptomsFlow({
    symptoms,
    hospitals: hospitalsForAI,
  });

  // 3. Merge AI ranking with hospital data
  const rankedHospitalsMap = new Map(
    rankedResults.map(r => [r.hospital, { rank: r.rank, reason: r.reason }])
  );

  const mergedHospitals: RankedHospital[] = hospitals.map(hospital => {
    const ranking = rankedHospitalsMap.get(hospital.name);
    const distance = haversineDistance(userLocation, hospital.coordinates);
    return {
      ...hospital,
      distance,
      rank: ranking?.rank,
      reason: ranking?.reason,
    };
  });

  // 4. Sort by AI rank, then by distance
  mergedHospitals.sort((a, b) => {
    const rankA = a.rank ?? Infinity;
    const rankB = b.rank ?? Infinity;
    if (rankA !== rankB) {
        return rankA - rankB;
    }
    return a.distance - b.distance;
  });
  
  return mergedHospitals;
}
