import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { Vehicle } from '../../models/vehicle';

@Component({
    selector: 'app-admin-vehicles',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './vehicles.component.html',
    styleUrl: './vehicles.component.css'
})
export class AdminVehiclesComponent implements OnInit {
    vehicles: Vehicle[] = [];
    isLoading = true;

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.loadVehicles();
    }

    loadVehicles(): void {
        this.isLoading = true;
        this.adminService.getAllVehicles().subscribe({
            next: (data) => {
                this.vehicles = data;
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    deleteVehicle(id: string): void {
        if (confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
            this.adminService.deleteVehicle(id).subscribe({
                next: () => {
                    this.vehicles = this.vehicles.filter(v => v._id !== id);
                }
            });
        }
    }

    getOwnerName(v: Vehicle): string {
        return typeof v.owner === 'object' && v.owner ? v.owner.name : 'Unknown';
    }
}
