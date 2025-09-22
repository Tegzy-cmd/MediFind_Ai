import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from './config';
import type { Hospital } from '@/lib/types';
import type { HospitalFormValues } from '@/lib/schema';

const HOSPITAL_COLLECTION = 'hospitals';

export async function getHospitals(): Promise<Hospital[]> {
  const querySnapshot = await getDocs(collection(db, HOSPITAL_COLLECTION));
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Hospital)
  );
}

export async function getHospital(id: string): Promise<Hospital | null> {
  const docRef = doc(db, HOSPITAL_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Hospital;
  }
  return null;
}

export async function addHospital(data: HospitalFormValues) {
  const hospitalData = {
    name: data.name,
    address: data.address,
    contact: data.contact,
    coordinates: {
      lat: data.lat,
      lng: data.lng,
    },
    specialties: data.specialties.split(',').map((s) => s.trim()),
    services: data.services.split(',').map((s) => s.trim()),
  };
  return addDoc(collection(db, HOSPITAL_COLLECTION), hospitalData);
}

export async function updateHospital(id: string, data: HospitalFormValues) {
  const hospitalData = {
    name: data.name,
    address: data.address,
    contact: data.contact,
    coordinates: {
      lat: data.lat,
      lng: data.lng,
    },
    specialties: data.specialties.split(',').map((s) => s.trim()),
    services: data.services.split(',').map((s) => s.trim()),
  };
  const docRef = doc(db, HOSPITAL_COLLECTION, id);
  return updateDoc(docRef, hospitalData);
}

export async function deleteHospital(id: string) {
  const docRef = doc(db, HOSPITAL_COLLECTION, id);
  return deleteDoc(docRef);
}
