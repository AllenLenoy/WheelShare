import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { AuthService } from '../../services/auth.service';
import { Vehicle } from '../../models/vehicle';

@Component({ selector: 'app-owner-vehicles', standalone: true, imports: [CommonModule, RouterModule], templateUrl: './vehicles.component.html', styleUrl: './vehicles.component.css' })
export class OwnerVehiclesComponent implements OnInit {
    vehicles: Vehicle[] = [];
    isLoading = true;

    constructor(private vehicleService: VehicleService, private authService: AuthService) {}

    ngOnInit(): void {
        const user = this.authService.getUser();
        if (user) {
            this.vehicleService.getOwnerVehicles(user._id).subscribe({
                next: (v) => { this.vehicles = v; this.isLoading = false; },
                error: () => this.isLoading = false
            });
        }
    }

    deleteVehicle(id: string): void {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            this.vehicleService.deleteVehicle(id).subscribe({ next: () => this.vehicles = this.vehicles.filter(v => v._id !== id) });
        }
    }

    getImage(v: Vehicle): string { return v.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=250&fit=crop&q=80'; }
}
