import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { ToastService } from '../../services/toast.service';

@Component({ selector: 'app-add-vehicle', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './add-vehicle.component.html', styleUrl: './add-vehicle.component.css' })
export class AddVehicleComponent {
    form = { name: '', brand: '', model: '', year: new Date().getFullYear(), type: 'Car', fuelType: 'Petrol', transmission: 'Automatic', pricePerDay: 0, location: '', seats: 5, description: '' };
    selectedFile: File | null = null;
    isSubmitting = false;
    errorMessage = '';

    constructor(private vehicleService: VehicleService, private router: Router, private toastService: ToastService) {}

    onFileSelected(event: Event): void { const input = event.target as HTMLInputElement; if (input.files?.length) this.selectedFile = input.files[0]; }

    submit(): void {
        if (!this.form.name || !this.form.brand || !this.form.model || !this.form.pricePerDay || !this.form.location) { this.errorMessage = 'Please fill all required fields'; return; }
        this.isSubmitting = true; this.errorMessage = '';
        const fd = new FormData();
        Object.entries(this.form).forEach(([k, v]) => fd.append(k, String(v)));
        if (this.selectedFile) fd.append('image', this.selectedFile);
        this.vehicleService.addVehicle(fd).subscribe({
            next: () => {
                this.toastService.success('Vehicle added successfully');
                this.router.navigate(['/owner/vehicles']);
            },
            error: (err) => { this.errorMessage = err.error?.message || 'Failed to add vehicle'; this.isSubmitting = false; }
        });
    }
}
