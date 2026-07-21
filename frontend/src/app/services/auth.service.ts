import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, AuthResponse } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'http://localhost:5000/api/auth';
    private userSubject = new BehaviorSubject<User | null>(this.getUser());

    user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) { }

    login(data: { email: string; password: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
            tap(response => {
                localStorage.setItem('token', response.user.token!);
                localStorage.setItem('user', JSON.stringify(response.user));
                this.userSubject.next(response.user);
            })
        );
    }

    register(data: { name: string; email: string; password: string; role: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
            tap(response => {
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

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.userSubject.next(null);
    }

    isLoggedIn(): boolean {
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