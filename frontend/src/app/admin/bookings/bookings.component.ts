import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Booking } from '../../models/booking';

@Component({
    selector: 'app-admin-bookings',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './bookings.component.html',
    styleUrl: './bookings.component.css'
})
export class AdminBookingsComponent implements OnInit {
    bookings: Booking[] = [];
    isLoading = true;

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.loadBookings();
    }

    loadBookings(): void {
        this.isLoading = true;
        this.adminService.getAllBookings().subscribe({
            next: (data) => {
                this.bookings = data;
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    getUserName(user: any): string {
        return typeof user === 'object' && user ? user.name : 'Unknown';
    }

    getVehicleName(vehicle: any): string {
        return typeof vehicle === 'object' && vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Unknown';
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Pending': return 'status-pending';
            case 'Accepted': return 'status-accepted';
            case 'Completed': return 'status-completed';
            case 'Cancelled': return 'status-cancelled';
            case 'Rejected': return 'status-rejected';
            default: return '';
        }
    }
}
