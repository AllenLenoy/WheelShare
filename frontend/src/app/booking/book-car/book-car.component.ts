import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Vehicle } from '../../models/vehicle';

@Component({
    selector: 'app-book-car',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './book-car.component.html',
    styleUrl: './book-car.component.css'
})
export class BookCarComponent implements OnInit {

    vehicle: Vehicle | null = null;
    isLoading = true;
    isBooking = false;
    bookingSuccess = false;
    bookingError = '';

    startDate = '';
    endDate = '';
    minDate = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private vehicleService: VehicleService,
        private bookingService: BookingService,
        private authService: AuthService
    ) {
        // Set min date to today
        const today = new Date();
        this.minDate = today.toISOString().split('T')[0];
    }

    ngOnInit(): void {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
            return;
        }

        const carId = this.route.snapshot.paramMap.get('carId');
        if (carId) {
            this.vehicleService.getVehicleById(carId).subscribe({
                next: (vehicle) => {
                    this.vehicle = vehicle;
                    this.isLoading = false;
                },
                error: () => {
                    this.isLoading = false;
                    this.router.navigate(['/vehicles']);
                }
            });
        }
    }

    get totalDays(): number {
        if (!this.startDate || !this.endDate) return 0;
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    }

    get totalPrice(): number {
        return this.totalDays * (this.vehicle?.pricePerDay || 0);
    }

    get isFormValid(): boolean {
        return !!this.startDate && !!this.endDate && this.totalDays > 0;
    }

    get displayImage(): string {
        return this.vehicle?.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop&q=80';
    }

    confirmBooking(): void {
        if (!this.vehicle || !this.isFormValid) return;

        this.isBooking = true;
        this.bookingError = '';

        this.bookingService.createBooking({
            vehicleId: this.vehicle._id,
            startDate: this.startDate,
            endDate: this.endDate,
            totalPrice: this.totalPrice
        }).subscribe({
            next: () => {
                this.bookingSuccess = true;
                this.isBooking = false;
            },
            error: (err) => {
                this.bookingError = err.error?.message || 'Booking failed. Please try again.';
                this.isBooking = false;
            }
        });
    }
}
