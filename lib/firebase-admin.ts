import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('FIREBASE_PRIVATE_KEY is not set in environment variables');
}

// Parse the private key properly
const privateKey = process.env.FIREBASE_PRIVATE_KEY.includes('\\n') 
  ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY)
  : process.env.FIREBASE_PRIVATE_KEY;

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  })
};

// Initialize only if not already initialized
const app = !getApps().length ? initializeApp(firebaseAdminConfig) : getApps()[0];
const adminAuth = getAuth(app);
const adminDb = getFirestore(app);

export { adminAuth, adminDb }; 