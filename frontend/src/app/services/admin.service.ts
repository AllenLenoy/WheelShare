import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Vehicle } from '../models/vehicle';
import { Booking } from '../models/booking';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = environment.apiUrl + '/admin';

    constructor(private http: HttpClient) { }

    getDashboardStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/dashboard`);
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users`);
    }

    updateUserRole(userId: string, role: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/user/${userId}/role`, { role });
    }

    deleteUser(userId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/user/${userId}`);
    }

    getAllVehicles(): Observable<Vehicle[]> {
        return this.http.get<Vehicle[]>(`${this.apiUrl}/vehicles`);
    }

    deleteVehicle(vehicleId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/vehicle/${vehicleId}`);
    }

    getAllBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${this.apiUrl}/bookings`);
    }
}
