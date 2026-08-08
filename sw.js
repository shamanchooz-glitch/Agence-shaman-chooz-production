const CACHE_NAME = "shaman-bara-center-v5";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./avatar.jpg",
  "./profile-full.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Stratégie : réseau d'abord pour les appels Firebase (données fraîches),
// cache d'abord pour les fichiers de l'application (fonctionnement hors-ligne).
self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  const isAppShell = CORE_ASSETS.some((a) => url.endsWith(a.replace("./", "")));

  if (isAppShell) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  } else if (url.includes("firestore.googleapis.com") || url.includes("firebaseapp.com")) {
    // Laisser Firestore gérer son propre cache/persistance IndexedDB
    return;
  } else {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
