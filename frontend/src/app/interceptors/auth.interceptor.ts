import { HttpInterceptorFn } from '@angular/common/http';

// ==========================================
// AUTHENTICATION INTERCEPTOR
// ==========================================
// An interceptor is a function that sits between your Angular app and the network.
// Because it is registered in `app.config.ts`, it automatically catches EVERY outgoing HTTP request.
// Its job is to attach the JWT token so the backend knows who is making the request.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    
    // 1. Retrieve the JWT token from the browser's Local Storage
    const token = localStorage.getItem('token');

    // 2. If a token exists (meaning the user is logged in)...
    if (token) {
        
        // 3. Clone the request. 
        // We MUST clone it because HTTP requests in Angular are immutable (they cannot be changed directly once created).
        const cloned = req.clone({
            setHeaders: {
                // Attach the standard 'Authorization' header in the 'Bearer <token>' format
                Authorization: `Bearer ${token}`
            }
        });
        
        // 4. Pass the cloned, modified request to the next handler in the chain (and eventually to the backend).
        return next(cloned);
    }

    // 5. If there is no token (e.g. they are a guest browsing vehicles), just pass the original request through untouched.
    return next(req);
};
