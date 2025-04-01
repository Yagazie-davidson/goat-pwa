importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBSusPmmCuRy89Hfp6SFpH4PVN6j52ECRg", // Keep this in your .env.local, but service workers can't read process.env
  authDomain: "goat-pwa.firebaseapp.com",
  projectId: "goat-pwa",
  storageBucket: "goat-pwa.firebasestorage.app",
  messagingSenderId: 762366605014,
  appId: "1:762366605014:web:ca1446a694decc65c3bb77",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icons/icon-192x192.png",
  });
});
