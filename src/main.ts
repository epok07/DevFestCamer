import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {
    if (!environment.production || !('serviceWorker' in navigator)) {
      return;
    }

    window.addEventListener('load', () => {
      // Register relative to the document base so the app also works when it is
      // served from a sub-path (for example GitHub Pages project sites).
      const swUrl = new URL('sw.js', document.baseURI).href;
      navigator.serviceWorker.register(swUrl).catch((error) => {
        console.warn('Service worker registration failed', error);
      });
    });
  })
  .catch((error) => console.error(error));
