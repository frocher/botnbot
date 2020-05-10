/* eslint no-restricted-globals: ["off", "self"] */
import { clientsClaim, skipWaiting } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies';

skipWaiting();
clientsClaim();

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

function handlePushEvent(event) {
  return Promise.resolve()
    .then(() => event.data.json())
    .then((data) => {
      const { options } = data;
      if (!options.icon) {
        options.icon = '/images/icon-512x512.png';
      }
      return registration.showNotification(data.title, options);
    })
    .catch(() => {
      const title = 'Message Received from Botnbot';
      const options = {
        body: event.data.text(),
        icon: '/images/icon-512x512.png',
      };
      return registration.showNotification(title, options);
    });
}

self.addEventListener('push', (event) => {
  event.waitUntil(handlePushEvent(event));
});

self.addEventListener('notificationclick', (e) => {
  const { notification, action } = e;
  if (action !== 'close' && notification.data && notification.data.url) {
    clients.openWindow(notification.data.url);
  }
  notification.close();
});

precacheAndRoute(self.__precacheManifest || self.__WB_MANIFEST);
