import { Vehicle } from './vehicle';
import { User } from './user';

export interface Booking {
    _id: string;
    customer: User | string;
    vehicle: Vehicle | string;
    owner: User | string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    paymentStatus: 'Pending' | 'Paid' | 'Refunded';
    status: 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled' | 'Completed';
    createdAt?: string;
    updatedAt?: string;
}
