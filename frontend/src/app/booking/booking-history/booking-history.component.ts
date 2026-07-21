import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { ToastService } from '../../services/toast.service';
import { Booking } from '../../models/booking';

@Component({
    selector: 'app-booking-history',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './booking-history.component.html',
    styleUrl: './booking-history.component.css'
})
export class BookingHistoryComponent implements OnInit {

    bookings: Booking[] = [];
    isLoading = true;
    activeTab: 'upcoming' | 'completed' | 'cancelled' = 'upcoming';

    constructor(private bookingService: BookingService, private toastService: ToastService) { }

    ngOnInit(): void {
        this.loadBookings();
    }

    loadBookings(): void {
        this.isLoading = true;
        this.bookingService.getMyBookings().subscribe({
            next: (bookings) => {
                this.bookings = bookings;
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    get upcomingBookings(): Booking[] {
        return this.bookings.filter(b => ['Pending', 'Accepted'].includes(b.status));
    }

    get completedBookings(): Booking[] {
        return this.bookings.filter(b => b.status === 'Completed');
    }

    get cancelledBookings(): Booking[] {
        return this.bookings.filter(b => ['Cancelled', 'Rejected'].includes(b.status));
    }

    get filteredBookings(): Booking[] {
        switch (this.activeTab) {
            case 'upcoming': return this.upcomingBookings;
            case 'completed': return this.completedBookings;
            case 'cancelled': return this.cancelledBookings;
        }
    }

    getVehicleName(booking: Booking): string {
        if (typeof booking.vehicle === 'object' && booking.vehicle) {
            return `${booking.vehicle.brand} ${booking.vehicle.model}`;
        }
        return 'Vehicle';
    }

    getVehicleImage(booking: Booking): string {
        if (typeof booking.vehicle === 'object' && booking.vehicle) {
            return booking.vehicle.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=250&fit=crop&q=80';
        }
        return 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=250&fit=crop&q=80';
    }

    cancelBooking(bookingId: string): void {
        if (confirm('Are you sure you want to cancel this booking?')) {
            this.bookingService.updateBookingStatus(bookingId, 'Cancelled').subscribe({
                next: () => {
                    const b = this.bookings.find(x => x._id === bookingId);
                    if (b) b.status = 'Cancelled';
                    this.toastService.success('Booking cancelled successfully');
                },
                error: (err) => this.toastService.error(err.error?.message || 'Failed to cancel booking')
            });
        }
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
