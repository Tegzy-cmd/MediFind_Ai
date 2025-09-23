
import * as admin from 'firebase-admin';
import { config } from 'dotenv';
config();

// IMPORTANT:
// 1. Download your service account key JSON file from your Firebase project settings.
// 2. Save it as 'serviceAccountKey.json' in the root of your project.
// 3. Make sure this file is listed in your .gitignore so it's not committed to source control.
const serviceAccount = require('../../serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

const db = admin.firestore();
const HOSPITAL_COLLECTION = 'hospitals';

async function removeDuplicateHospitals() {
  console.log('Starting duplicate removal process...');

  const hospitalsRef = db.collection(HOSPITAL_COLLECTION);
  const snapshot = await hospitalsRef.get();

  if (snapshot.empty) {
    console.log('No hospitals found in the database.');
    return;
  }

  const seen = new Map<string, string>(); // Map to store unique identifiers and their document IDs
  const duplicates: admin.firestore.QueryDocumentSnapshot[] = [];

  for (const doc of snapshot.docs) {
    const hospital = doc.data();
    // Create a unique key based on name and address
    const uniqueKey = `${hospital.name.trim().toLowerCase()}|${hospital.address.trim().toLowerCase()}`;

    if (seen.has(uniqueKey)) {
      console.log(`Found duplicate: "${hospital.name}" (ID: ${doc.id}). Will be deleted.`);
      duplicates.push(doc);
    } else {
      seen.set(uniqueKey, doc.id);
      console.log(`Keeping unique hospital: "${hospital.name}" (ID: ${doc.id})`);
    }
  }

  if (duplicates.length === 0) {
    console.log('No duplicate hospitals found. Your database is clean!');
    return;
  }

  console.log(`\nFound ${duplicates.length} duplicate(s) to delete.`);

  // Create a batch to delete all duplicates at once
  const batch = db.batch();
  duplicates.forEach(doc => {
    batch.delete(doc.ref);
  });

  try {
    await batch.commit();
    console.log(`\nSuccessfully deleted ${duplicates.length} duplicate hospital(s).`);
  } catch (error) {
    console.error('Error deleting duplicates:', error);
  }

  console.log('\nDuplicate removal process finished.');
}

removeDuplicateHospitals().catch(console.error);
