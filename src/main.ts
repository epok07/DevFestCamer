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
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.warn('Service worker registration failed', error);
      });
    });
  })
  .catch((error) => console.error(error));
