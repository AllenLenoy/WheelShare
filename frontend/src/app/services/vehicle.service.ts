import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../models/vehicle';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {

    private apiUrl = 'http://localhost:5000/api/vehicles';

    constructor(private http: HttpClient) { }

    getAllVehicles(): Observable<Vehicle[]> {
        return this.http.get<Vehicle[]>(this.apiUrl);
    }

    getVehicleById(id: string): Observable<Vehicle> {
        return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
    }

    searchVehicles(filters: {
        type?: string;
        location?: string;
        brand?: string;
        price?: number;
    }): Observable<Vehicle[]> {
        let params = new HttpParams();
        if (filters.type) params = params.set('type', filters.type);
        if (filters.location) params = params.set('location', filters.location);
        if (filters.brand) params = params.set('brand', filters.brand);
        if (filters.price) params = params.set('price', filters.price.toString());
        return this.http.get<Vehicle[]>(`${this.apiUrl}/search`, { params });
    }

    getOwnerVehicles(ownerId: string): Observable<Vehicle[]> {
        return this.http.get<Vehicle[]>(`${this.apiUrl}/owner/${ownerId}`);
    }

    addVehicle(formData: FormData): Observable<any> {
        return this.http.post(this.apiUrl, formData);
    }

    updateVehicle(id: string, formData: FormData): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, formData);
    }

    deleteVehicle(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
