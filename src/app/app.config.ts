import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouteReuseStrategy, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { CustomReuseStrategy } from './common/custom-reuse-strategy';

export const appConfig: ApplicationConfig = {
      providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withComponentInputBinding()), {
            provide: RouteReuseStrategy,
            useExisting: CustomReuseStrategy
        },
        provideHttpClient()
    ]
};
