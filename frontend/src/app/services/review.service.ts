import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {

    private apiUrl = 'http://localhost:5000/api/reviews';

    constructor(private http: HttpClient) { }

    getVehicleReviews(vehicleId: string): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.apiUrl}/vehicle/${vehicleId}`);
    }

    addReview(data: { vehicleId: string; rating: number; comment: string }): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }

    deleteReview(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
