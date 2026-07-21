import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking';

@Component({ selector: 'app-owner-bookings', standalone: true, imports: [CommonModule], templateUrl: './bookings.component.html', styleUrl: './bookings.component.css' })
export class OwnerBookingsComponent implements OnInit {
    bookings: Booking[] = [];
    isLoading = true;

    constructor(private bookingService: BookingService) {}

    ngOnInit(): void {
        this.bookingService.getOwnerBookings().subscribe({ next: (b) => { this.bookings = b; this.isLoading = false; }, error: () => this.isLoading = false });
    }

    updateStatus(id: string, status: string): void {
        this.bookingService.updateBookingStatus(id, status).subscribe({ next: () => { const b = this.bookings.find(x => x._id === id); if (b) b.status = status as any; } });
    }

    getCustomerName(b: Booking): string { return typeof b.customer === 'object' ? b.customer.name : 'Customer'; }
    getVehicleName(b: Booking): string { return typeof b.vehicle === 'object' ? `${b.vehicle.brand} ${b.vehicle.model}` : 'Vehicle'; }
    getStatusClass(s: string): string { return `status-${s.toLowerCase()}`; }
}
