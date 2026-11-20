// Minimal service worker: lets the app install and keeps static game files available offline.
const CACHE = "reach-v17";
const ASSETS = ["/", "/game/group.js", "/game/game.js", "/game/ai.js", "/game/avatar.js", "/game/cast.js", "/game/challenges.js", "/game/scenes/bar.js", "/game/scenes/restaurant.js", "/game/scenes/interview.js", "/game/scenes/electronics.js", "/game/scenes/beverage.js", "/game/scenes/office.js", "/game/scenes/bank.js", "/game/scenes/wedding.js", "/game/scenes/graduation.js", "/game/scenes/debate.js", "/game/scenes/qa.js", "/game/scenes/press.js", "/game/scenes/doorstep.js", "/game/scenes/stadium.js", "/game/scenes/park.js", "/game/scenes/cafeteria.js", "/game/scenes/club.js", "/game/scenes/boardroom.js", "/game/scenes/sharktank.js", "/game/scenes/shop.js", "/game/scenes/clientoffice.js", "/game/scenes/loan.js", "/game/scenes/busstop.js", "/game/scenes/cafe.js", "/vendor/three.min.js", "/icon.svg"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin || u.pathname.startsWith("/api/")) return;
  e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
