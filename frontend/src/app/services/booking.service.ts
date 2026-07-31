import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking';

@Injectable({
    providedIn: 'root'
})
export class BookingService {

    private apiUrl = environment.apiUrl + '/bookings';

    constructor(private http: HttpClient) { }

    createBooking(data: {
        vehicleId: string;
        startDate: string;
        endDate: string;
        totalPrice: number;
    }): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }

    getMyBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${this.apiUrl}/my-bookings`);
    }

    getOwnerBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${this.apiUrl}/owner-bookings`);
    }

    getBookingById(id: string): Observable<Booking> {
        return this.http.get<Booking>(`${this.apiUrl}/${id}`);
    }

    updateBookingStatus(id: string, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/status`, { status });
    }
}
