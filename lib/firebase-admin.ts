import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Function to format the private key correctly
function formatPrivateKey(key: string) {
  // If the key already contains newlines, assume it's properly formatted
  if (key.includes("\n")) return key;
  
  // Add newlines after every 64 characters and proper header/footer
  const header = "-----BEGIN PRIVATE KEY-----\n";
  const footer = "\n-----END PRIVATE KEY-----\n";
  
  // Remove header and footer if they exist
  key = key.replace(/-----BEGIN PRIVATE KEY-----/, "")
           .replace(/-----END PRIVATE KEY-----/, "")
           .replace(/\\n/g, "")
           .replace(/\s/g, "");
           
  // Insert a newline after every 64 characters
  const matches = key.match(/.{1,64}/g) || [];
  return header + matches.join("\n") + footer;
}

if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('FIREBASE_PRIVATE_KEY is not set in environment variables');
}

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY)
  })
};

// Initialize only if not already initialized
const app = !getApps().length ? initializeApp(firebaseAdminConfig) : getApps()[0];
const adminAuth = getAuth(app);
const adminDb = getFirestore(app);
export { adminAuth, adminDb }; 