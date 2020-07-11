import { Workbox, messageSW } from 'workbox-window';
import './components/bnb-app';

// HACK(keanulee): The Redux package assumes `process` exists - mock it here before
// the module is loaded.
window.process = {
  env: {
    NODE_ENV: 'production',
  },
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const wb = new Workbox('/service-worker.js');
    let registration;

    const showSkipWaitingPrompt = () => {
      const params = {
        onAccept: async () => {
          wb.addEventListener('controlling', () => {
            window.location.reload();
          });

          if (registration && registration.waiting) {
            messageSW(registration.waiting, { type: 'SKIP_WAITING' });
          }
        },
      };
      const bnbApp = document.querySelector('bnb-app');
      bnbApp.showReloadSnack(params);
    };

    wb.addEventListener('waiting', showSkipWaitingPrompt);
    wb.addEventListener('externalwaiting', showSkipWaitingPrompt);
    wb.register().then((reg) => {
      registration = reg;
    });
  });
}
