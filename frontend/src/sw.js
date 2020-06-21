/* eslint no-restricted-globals: ["off", "self"] */
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {
  CacheFirst, NetworkFirst, NetworkOnly, StaleWhileRevalidate,
} from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';


// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  }),
);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  }),
);

registerRoute(
  /.*\.js/,
  new StaleWhileRevalidate({
    cacheName: 'js-cache',
  }),
);

registerRoute(
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  new StaleWhileRevalidate({
    cacheName: 'image-cache',
  }),
);

registerRoute(
  /\/api\//,
  new NetworkFirst({
    cacheName: 'api-cache',
  }),
);

registerRoute(
  /\/omniauth\//,
  new NetworkOnly(),
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

function handlePushEvent(event) {
  return Promise.resolve()
    .then(() => event.data.json())
    .then((data) => {
      const { options } = data;
      if (!options.icon) {
        options.icon = '/images/icon-512x512.png';
      }
      // eslint-disable-next-line no-undef
      return registration.showNotification(data.title, options);
    })
    .catch(() => {
      const title = 'Message Received from Botnbot';
      const options = {
        body: event.data.text(),
        icon: '/images/icon-512x512.png',
      };
      // eslint-disable-next-line no-undef
      return registration.showNotification(title, options);
    });
}

self.addEventListener('push', (event) => {
  event.waitUntil(handlePushEvent(event));
});

self.addEventListener('notificationclick', (e) => {
  const { notification, action } = e;
  if (action !== 'close' && notification.data && notification.data.url) {
    // eslint-disable-next-line no-undef
    clients.openWindow(notification.data.url);
  }
  notification.close();
});

precacheAndRoute(self.__precacheManifest || self.__WB_MANIFEST);
