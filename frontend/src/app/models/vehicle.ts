export interface Vehicle {
    _id: string;
    owner: {
        _id: string;
        name: string;
        email: string;
    } | string;
    name: string;
    brand: string;
    model: string;
    year: number;
    type: 'Car' | 'Bike' | 'Scooter';
    fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
    transmission: 'Manual' | 'Automatic';
    pricePerDay: number;
    location: string;
    image: string;
    images?: string[];
    seats: number;
    description: string;
    averageRating: number;
    available: boolean;
    createdAt?: string;
    updatedAt?: string;
}
