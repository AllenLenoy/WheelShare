import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { ToastService } from '../../services/toast.service';

@Component({ selector: 'app-edit-vehicle', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './edit-vehicle.component.html', styleUrl: './edit-vehicle.component.css' })
export class EditVehicleComponent implements OnInit {
    form: any = {};
    selectedFile: File | null = null;
    isLoading = true;
    isSubmitting = false;
    errorMessage = '';
    vehicleId = '';

    constructor(private vehicleService: VehicleService, private route: ActivatedRoute, private router: Router, private toastService: ToastService) {}

    ngOnInit(): void {
        this.vehicleId = this.route.snapshot.paramMap.get('id') || '';
        if (this.vehicleId) {
            this.vehicleService.getVehicleById(this.vehicleId).subscribe({
                next: (v) => { this.form = { name: v.name, brand: v.brand, model: v.model, year: v.year, type: v.type, fuelType: v.fuelType, transmission: v.transmission, pricePerDay: v.pricePerDay, location: v.location, seats: v.seats, description: v.description, available: v.available, imageUrl: v.image && v.image.startsWith('http') ? v.image : '' }; this.isLoading = false; },
                error: () => this.router.navigate(['/owner/vehicles'])
            });
        }
    }

    onFileSelected(event: Event): void { const input = event.target as HTMLInputElement; if (input.files?.length) this.selectedFile = input.files[0]; }

    submit(): void {
        this.isSubmitting = true; this.errorMessage = '';
        const fd = new FormData();
        Object.entries(this.form).forEach(([k, v]) => fd.append(k, String(v)));
        if (this.selectedFile) fd.append('image', this.selectedFile);
        this.vehicleService.updateVehicle(this.vehicleId, fd).subscribe({
            next: () => {
                this.toastService.success('Vehicle updated successfully');
                this.router.navigate(['/owner/vehicles']);
            },
            error: (err) => { this.errorMessage = err.error?.message || 'Failed to update vehicle'; this.isSubmitting = false; }
        });
    }
}
