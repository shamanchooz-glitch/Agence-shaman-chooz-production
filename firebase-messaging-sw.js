/* Service worker dédié aux notifications push (Firebase Cloud Messaging).
   Doit rester à la racine du site, avec ce nom exact.
   Reçoit et affiche les notifications même quand l'application est fermée. */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDv-jwjrB32qFQEzFj1unKD0evkmLH4OFg",
  authDomain: "shaman-bara-center-agence.firebaseapp.com",
  projectId: "shaman-bara-center-agence",
  storageBucket: "shaman-bara-center-agence.firebasestorage.app",
  messagingSenderId: "286946414728",
  appId: "1:286946414728:web:65be4307ad1ffaadb40f3d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "Agence Shaman Chooz Production";
  const body = (payload.notification && payload.notification.body) || "";
  self.registration.showNotification(title, {
    body,
    icon: "icon-192.png",
    badge: "icon-192.png"
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("./");
    })
  );
});
