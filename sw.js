// =====================================================
// SERVICE WORKER — Mercadeo PCB
// Maneja push notifications para smartphones y desktop
// =====================================================

const SW_VERSION = 'mercadeopcb-sw-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// ── Push Notifications (enviadas desde servidor o Supabase) ──────────────────
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {}

  const title  = data.title  || '🏪 Mercadeo PCB';
  const body   = data.body   || '¡Tienes una notificación nueva!';
  const icon   = data.icon   || '/galeria/image1.png';
  const tag    = data.tag    || 'mercadeopcb';
  const url    = data.url    || '/';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge: '/galeria/image1.png',
      tag,
      data: { url },
      vibrate: [200, 100, 200],
      requireInteraction: data.requireInteraction || false
    })
  );
});

// ── Click en la notificación ──────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Si ya hay una pestaña abierta, enfócarla
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abrir una nueva
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ── Mensajes desde la página (para mostrar notificación local) ───────────────
self.addEventListener('message', event => {
  if (!event.data) return;

  if (event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, tag, url } = event.data;
    self.registration.showNotification(title || '🏪 Mercadeo PCB', {
      body:    body   || '',
      icon:    icon   || '/galeria/image1.png',
      badge:   '/galeria/image1.png',
      tag:     tag    || 'mercadeopcb',
      data:    { url: url || '/' },
      vibrate: [200, 100, 200]
    });
  }
});

