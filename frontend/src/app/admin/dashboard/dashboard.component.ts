import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

    stats: any = null;
    isLoading = true;

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.adminService.getDashboardStats().subscribe({
            next: (data) => {
                this.stats = data;
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }
}
