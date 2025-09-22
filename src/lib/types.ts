export type Hospital = {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  contact: string;
  services: string[];
  specialties: string[];
};

export type RankedHospital = Hospital & {
  rank?: number;
  reason?: string;
  distance?: number;
};
