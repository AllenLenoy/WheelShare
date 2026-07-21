import { User } from './user';

export interface Review {
    _id: string;
    user: User | string;
    vehicle: string;
    rating: number;
    comment: string;
    createdAt?: string;
    updatedAt?: string;
}
