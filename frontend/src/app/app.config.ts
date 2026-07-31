import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';

import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule, SOCIAL_AUTH_CONFIG, SocialAuthService } from '@abacritt/angularx-social-login';
import { importProvidersFrom } from '@angular/core';

// ==========================================
// ANGULAR APPLICATION CONFIGURATION
// ==========================================
// In modern Angular (v17+), we use standalone components and an app.config.ts file instead of a bulky app.module.ts.
// This file dictates the global settings and services available to the entire application upon startup.
export const appConfig: ApplicationConfig = {

  // The 'providers' array makes these services available for Dependency Injection (DI) everywhere in the app.
  providers: [

    // 1. Change Detection Optimization
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 2. Client-Side Routing
    provideRouter(routes),

    // 3. HTTP Client & Interceptors
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),

    // 4. Social Auth Configuration (Google Login)
    SocialAuthService,
    {
      provide: SOCIAL_AUTH_CONFIG,
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '573555034650-aeg8ur587ptvqqtpisghfqjmgnv56rh1.apps.googleusercontent.com' // Replace with your actual Client ID
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ]
};
