import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Vehicle } from '../../models/vehicle';

@Component({
    selector: 'app-vehicle-card',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './vehicle-card.component.html',
    styleUrl: './vehicle-card.component.css'
})
export class VehicleCardComponent {
    @Input() vehicle!: Vehicle;

    get ownerName(): string {
        if (typeof this.vehicle.owner === 'object' && this.vehicle.owner) {
            return this.vehicle.owner.name;
        }
        return '';
    }

    get displayImage(): string {
        return this.vehicle.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop&q=80';
    }

    getStars(rating: number): string[] {
        const stars: string[] = [];
        const full = Math.floor(rating);
        const hasHalf = rating - full >= 0.5;
        for (let i = 0; i < full; i++) stars.push('★');
        if (hasHalf) stars.push('★');
        while (stars.length < 5) stars.push('☆');
        return stars;
    }
}
