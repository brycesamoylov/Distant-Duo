import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getPrivateKey() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('FIREBASE_PRIVATE_KEY is not set');
  }

  // If the key is already properly formatted with headers and newlines
  if (privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    return privateKey;
  }

  // If the key has JSON-escaped newlines
  if (privateKey.includes('\\n')) {
    return privateKey.replace(/\\n/g, '\n');
  }

  // If it's a raw key, add the headers
  return `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----\n`;
}

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: getPrivateKey()
  })
};

const app = !getApps().length ? initializeApp(firebaseAdminConfig) : getApps()[0];
const adminAuth = getAuth(app);
const adminDb = getFirestore(app);

export { adminAuth, adminDb }; 