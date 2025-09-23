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
  distance: number;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type UserProfile = {
  uid: string;
  email: string;
  role: 'admin' | 'viewer';
  createdAt: Date;
};
