import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';
import { AuthService } from '../../services/auth.service';
import { Vehicle } from '../../models/vehicle';
import { VehicleCardComponent } from '../../vehicles/vehicle-card/vehicle-card.component';

@Component({
    selector: 'app-customer-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, VehicleCardComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class CustomerDashboardComponent implements OnInit {

    vehicles: Vehicle[] = [];
    filteredVehicles: Vehicle[] = [];
    featuredVehicles: Vehicle[] = [];
    isLoading = true;
    userName = '';

    searchQuery = '';
    selectedCategory = '';
    categories = ['Car', 'Bike', 'Scooter'];

    constructor(
        private vehicleService: VehicleService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        const user = this.authService.getUser();
        this.userName = user?.name || 'there';
        this.loadVehicles();
    }

    loadVehicles(): void {
        this.vehicleService.getAllVehicles().subscribe({
            next: (vehicles) => {
                this.vehicles = vehicles.filter(v => v.available);
                this.filteredVehicles = this.vehicles;
                this.featuredVehicles = this.vehicles
                    .sort((a, b) => b.averageRating - a.averageRating)
                    .slice(0, 3);
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    filterByCategory(category: string): void {
        this.selectedCategory = this.selectedCategory === category ? '' : category;
        this.applyFilters();
    }

    applyFilters(): void {
        this.filteredVehicles = this.vehicles.filter(v => {
            const matchesSearch = !this.searchQuery ||
                v.brand.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                v.model.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                v.location.toLowerCase().includes(this.searchQuery.toLowerCase());
            const matchesCat = !this.selectedCategory || v.type === this.selectedCategory;
            return matchesSearch && matchesCat;
        });
    }
}
