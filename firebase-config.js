import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

let messaging = null;
let getToken = null;
let onMessage = null;

if (typeof window !== "undefined") {
  import("firebase/messaging").then((firebaseMessaging) => {
    messaging = firebaseMessaging.getMessaging(app);
    getToken = firebaseMessaging.getToken;
    onMessage = firebaseMessaging.onMessage;
  });
}

export { messaging, getToken, onMessage };
