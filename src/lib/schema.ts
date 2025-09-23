import { z } from 'zod';

export const hospitalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  contact: z.string().min(1, 'Contact number is required'),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  specialties: z.string().min(1, 'At least one specialty is required'),
  services: z.string().min(1, 'At least one service is required'),
});

export type HospitalFormValues = z.infer<typeof hospitalSchema>;
