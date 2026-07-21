import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Vehicle } from '../../models/vehicle';
import { Booking } from '../../models/booking';

@Component({
    selector: 'app-owner-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class OwnerDashboardComponent implements OnInit {

    vehicles: Vehicle[] = [];
    bookings: Booking[] = [];
    isLoading = true;
    userName = '';

    constructor(
        private vehicleService: VehicleService,
        private bookingService: BookingService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        const user = this.authService.getUser();
        this.userName = user?.name || 'Owner';
        if (user) {
            this.loadData(user._id);
        }
    }

    loadData(ownerId: string): void {
        this.vehicleService.getOwnerVehicles(ownerId).subscribe({
            next: (v) => { this.vehicles = v; this.checkLoaded(); },
            error: () => this.checkLoaded()
        });
        this.bookingService.getOwnerBookings().subscribe({
            next: (b) => { this.bookings = b; this.checkLoaded(); },
            error: () => this.checkLoaded()
        });
    }

    private loadCount = 0;
    private checkLoaded(): void { if (++this.loadCount >= 2) this.isLoading = false; }

    get totalVehicles(): number { return this.vehicles.length; }
    get activeBookings(): number { return this.bookings.filter(b => ['Pending', 'Accepted'].includes(b.status)).length; }
    get completedBookings(): number { return this.bookings.filter(b => b.status === 'Completed').length; }
    get totalRevenue(): number { return this.bookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.totalPrice, 0); }
    get pendingBookings(): Booking[] { return this.bookings.filter(b => b.status === 'Pending').slice(0, 5); }
}
