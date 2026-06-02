import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPex7pFq0S35TRZDjPGNqmDQJ6e3OVvLs",
  authDomain: "stockseo-ai-ec6ac.firebaseapp.com",
  projectId: "stockseo-ai-ec6ac",
  storageBucket: "stockseo-ai-ec6ac.firebasestorage.app",
  messagingSenderId: "675369413767",
  appId: "1:675369413767:web:38f3678903bb1c891bdc22",
  measurementId: "G-Q0474SMDDD",
};

const app = initializeApp(firebaseConfig);

let analytics: ReturnType<typeof getAnalytics> | null = null;
try {
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
} catch (_) {}

export { analytics };
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });
