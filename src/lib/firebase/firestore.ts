import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  query,
  limit,
  getFirestore,
} from 'firebase/firestore';
import { app } from './config';
import type { Hospital, UserProfile } from '@/lib/types';
import type { HospitalFormValues } from '@/lib/schema';

const db = getFirestore(app);

const HOSPITAL_COLLECTION = 'hospitals';
const USER_COLLECTION = 'users';

// Hospital Functions
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

// User Profile Functions
export async function createUserProfile(uid: string, data: { email: string }) {
  const usersRef = collection(db, USER_COLLECTION);
  const q = query(usersRef, limit(1));
  const snapshot = await getDocs(q);

  let role = 'viewer';
  // If there are no users in the database, make the first one an admin
  if (snapshot.empty) {
    role = 'admin';
  }

  return setDoc(doc(db, USER_COLLECTION, uid), {
    ...data,
    role,
    createdAt: new Date(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, USER_COLLECTION, uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
  }
  return null;
}
