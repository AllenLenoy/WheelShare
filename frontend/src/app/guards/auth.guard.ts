import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

// ==========================================
// AUTHENTICATION GUARD
// ==========================================
// A Route Guard is a function that runs before the Angular Router allows the user to view a page.
// This specific guard ensures the user is logged in. 
// It is applied in app.routes.ts using `canActivate: [authGuard]`.
export const authGuard: CanActivateFn = (route, state) => {
    
    // 1. Dependency Injection in Functional Guards:
    // Because this is a standard function and not a class, we cannot use a constructor to get our services.
    // Instead, modern Angular (v14+) allows us to use the `inject()` function to grab our Router and AuthService.
    const authService = inject(AuthService);
    const router = inject(Router);

    // 2. Check the user's login state
    if (authService.isLoggedIn()) {
        // If they have a token in localStorage, return true. 
        // Returning true tells the Router: "Let them pass and load the component."
        return true;
    }

    // 3. If they are NOT logged in, we block them and force them to the login page.
    // The `queryParams: { returnUrl: state.url }` part is a UX trick: 
    // We save the URL they were *trying* to visit (e.g. '/book/123') in the URL bar.
    // When they finish logging in, the LoginComponent can read this and automatically redirect them back to '/book/123'.
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    
    // Returning false tells the Router: "Cancel the navigation immediately."
    return false;
};
