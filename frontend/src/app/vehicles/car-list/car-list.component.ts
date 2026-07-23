import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';

@Component({
    selector: 'app-car-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, VehicleCardComponent],
    templateUrl: './car-list.component.html',
    styleUrl: './car-list.component.css'
})
export class CarListComponent implements OnInit {

    vehicles: Vehicle[] = [];
    filteredVehicles: Vehicle[] = [];
    isLoading = true;

    // Filter states
    searchQuery = '';
    selectedType = '';
    selectedFuel = '';
    selectedTransmission = '';
    selectedLocation = '';
    maxPrice: number | null = null;

    types = ['Car', 'Bike', 'Scooter'];
    fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
    transmissions = ['Manual', 'Automatic'];
    locations: string[] = [];

    constructor(private vehicleService: VehicleService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params['location']) this.searchQuery = params['location']; // Use searchQuery for location input from home
            if (params['type']) this.selectedType = params['type'];
            this.loadVehicles();
        });
    }

    loadVehicles(): void {
        this.isLoading = true;
        this.vehicleService.getAllVehicles().subscribe({
            next: (vehicles) => {
                this.vehicles = vehicles;
                this.locations = [...new Set(vehicles.map(v => v.location))].sort();
                this.applyFilters();
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load vehicles', err);
                this.isLoading = false;
            }
        });
    }

    applyFilters(): void {
        this.filteredVehicles = this.vehicles.filter(v => {
            const matchesSearch = !this.searchQuery ||
                v.brand.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                v.model.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                v.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                v.location.toLowerCase().includes(this.searchQuery.toLowerCase());

            const matchesType = !this.selectedType || v.type === this.selectedType;
            const matchesFuel = !this.selectedFuel || v.fuelType === this.selectedFuel;
            const matchesTrans = !this.selectedTransmission || v.transmission === this.selectedTransmission;
            const matchesLocation = !this.selectedLocation || v.location === this.selectedLocation;
            const matchesPrice = !this.maxPrice || v.pricePerDay <= this.maxPrice;

            return matchesSearch && matchesType && matchesFuel && matchesTrans && matchesLocation && matchesPrice;
        });
    }

    clearFilters(): void {
        this.searchQuery = '';
        this.selectedType = '';
        this.selectedFuel = '';
        this.selectedTransmission = '';
        this.selectedLocation = '';
        this.maxPrice = null;
        this.filteredVehicles = this.vehicles;
    }

    get activeFilterCount(): number {
        let count = 0;
        if (this.selectedType) count++;
        if (this.selectedFuel) count++;
        if (this.selectedTransmission) count++;
        if (this.selectedLocation) count++;
        if (this.maxPrice) count++;
        return count;
    }
}
