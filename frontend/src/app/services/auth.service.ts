import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, AuthResponse } from '../models/user';

// @Injectable({ providedIn: 'root' }) makes this service a "Singleton".
// This means Angular creates exactly ONE instance of AuthService for the entire application,
// and shares it anywhere it is injected. This is crucial so that the login state is shared across all pages.
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'http://localhost:5000/api/auth';
    
    // ==========================================
    // BEHAVIORSUBJECT (STATE MANAGEMENT)
    // ==========================================
    // A BehaviorSubject is a special type of RxJS Observable that "remembers" its current value.
    // We initialize it with `this.getUser()` (which checks localStorage to see if they are already logged in).
    private userSubject = new BehaviorSubject<User | null>(this.getUser());

    // We expose it as a public standard Observable (`user$`).
    // Components (like the Navbar) can subscribe to this to instantly know if a user is logged in,
    // and it will automatically update the Navbar UI the moment the user logs in or out.
    user$ = this.userSubject.asObservable();

    // Dependency Injection: Angular automatically provides the HttpClient so we can make API requests.
    constructor(private http: HttpClient) { }

    // ==========================================
    // LOGIN METHOD
    // ==========================================
    login(data: { email: string; password: string }): Observable<AuthResponse> {
        // We make a POST request to our Node backend. It returns an Observable.
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
            // The 'tap' operator allows us to do a "side effect" with the response data BEFORE it reaches the component.
            tap(response => {
                // We save the JWT token and user details to the browser's Local Storage so they stay logged in if they refresh the page.
                localStorage.setItem('token', response.user.token!);
                localStorage.setItem('user', JSON.stringify(response.user));
                
                // We push the new user data into our BehaviorSubject, which notifies all subscribed components (like Navbar) to update.
                this.userSubject.next(response.user);
            })
        );
    }

    // ==========================================
    // REGISTER METHOD
    // ==========================================
    register(data: { name: string; email: string; password: string; role: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
            tap(response => {
                // Similar to login, we automatically log the user in after they successfully register.
                localStorage.setItem('token', response.user.token!);
                localStorage.setItem('user', JSON.stringify(response.user));
                this.userSubject.next(response.user);
            })
        );
    }

    getProfile(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/profile`);
    }

    updateProfile(data: { name?: string; email?: string }): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/profile`, data).pipe(
            tap(user => {
                // If they update their name/email, we need to update LocalStorage and the BehaviorSubject
                // so the UI reflects the new name immediately.
                const current = this.getUser();
                const updated = { ...current, ...user };
                localStorage.setItem('user', JSON.stringify(updated));
                this.userSubject.next(updated as User);
            })
        );
    }

    changePassword(data: { oldPassword: string; newPassword: string }): Observable<any> {
        return this.http.put(`${this.apiUrl}/change-password`, data);
    }

    // ==========================================
    // LOGOUT METHOD
    // ==========================================
    logout(): void {
        // Clear the data from the browser memory
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Push 'null' to the BehaviorSubject. The Navbar will see this and change the "Profile" button back to "Login".
        this.userSubject.next(null);
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================
    isLoggedIn(): boolean {
        // The !! syntax converts the token string into a boolean (true if it exists, false if it's null).
        return !!this.getToken();
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getUser(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    getUserRole(): string | null {
        const user = this.getUser();
        return user ? user.role : null;
    }
}