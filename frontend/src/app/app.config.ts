import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';

// ==========================================
// ANGULAR APPLICATION CONFIGURATION
// ==========================================
// In modern Angular (v17+), we use standalone components and an app.config.ts file instead of a bulky app.module.ts.
// This file dictates the global settings and services available to the entire application upon startup.
export const appConfig: ApplicationConfig = {
  
  // The 'providers' array makes these services available for Dependency Injection (DI) everywhere in the app.
  providers: [
    
    // 1. Change Detection Optimization
    // Angular uses 'zone.js' to detect when variables change so it can update the HTML on the screen.
    // 'eventCoalescing: true' tells Angular to batch multiple rapid events into a single screen update.
    // This reduces latency and makes the website feel much faster.
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // 2. Client-Side Routing
    // This activates the Angular Router using the rules we defined in app.routes.ts.
    provideRouter(routes),
    
    // 3. HTTP Client & Interceptors
    // provideHttpClient() allows our services (like AuthService) to make GET/POST requests to the Node.js backend.
    // withInterceptors() attaches our custom middleware to the HTTP pipeline.
    // Because we register them here, EVERY outgoing request will automatically trigger 'authInterceptor' and 'loadingInterceptor'.
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor]))
  ]
};
