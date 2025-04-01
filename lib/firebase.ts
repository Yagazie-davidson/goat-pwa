import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let messaging: any = null;

export const initializeFirebase = async () => {
  try {
    const app = initializeApp(firebaseConfig);

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register the service worker
      await navigator.serviceWorker.register("/firebase-messaging-sw.js");

      // Initialize Firebase Cloud Messaging
      messaging = getMessaging(app);

      // Handle incoming messages when the app is in the foreground
      onMessage(messaging, (payload) => {
        console.log("Message received in the foreground:", payload);
        // You can show a custom notification here if you want
        const { notification } = payload;
        if (notification) {
          new Notification(notification.title || "New Notification", {
            body: notification.body,
            icon: notification.icon || "/icon-192x192.png",
          });
        }
      });
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error;
  }
};

export const requestNotificationPermission = async () => {
  try {
    // Request permission
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    throw error;
  }
};

export const subscribeToTopic = async (topic: string) => {
  try {
    if (!messaging) {
      throw new Error("Firebase messaging is not initialized");
    }

    // Get the FCM token
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (currentToken) {
      console.log("FCM Token:", currentToken);

      // In a real app, you would send this token to your server
      // to associate it with the user and the topic
      console.log(`Subscribed to topic: ${topic}`);

      return currentToken;
    } else {
      throw new Error("No registration token available");
    }
  } catch (error) {
    console.error("Error subscribing to topic:", error);
    throw error;
  }
};
