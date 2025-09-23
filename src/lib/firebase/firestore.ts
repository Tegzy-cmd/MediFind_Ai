
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
} from 'firebase/firestore';
import { auth, db } from './config';
import type { Hospital, UserProfile } from '@/lib/types';
import type { HospitalFormValues } from '@/lib/schema';
import { signOut } from 'firebase/auth';


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
export async function createUserProfile(uid: string, data: { email: string, role?: 'admin' | 'viewer' }) {
  const userDocRef = doc(db, USER_COLLECTION, uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return;
  }

  // If a role is explicitly passed (e.g., for the first admin), use it.
  if (data.role) {
    return setDoc(userDocRef, {
      email: data.email,
      role: data.role,
      createdAt: new Date(),
    });
  }

  const usersQuery = query(collection(db, USER_COLLECTION), limit(1));
  const snapshot = await getDocs(usersQuery);

  const role = snapshot.empty ? 'admin' : 'viewer';

  return setDoc(userDocRef, {
    email: data.email,
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

export async function signOutUser() {
  return signOut(auth);
}
