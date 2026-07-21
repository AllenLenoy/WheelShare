import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/user';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css'
})
export class AdminUsersComponent implements OnInit {
    users: User[] = [];
    isLoading = true;

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.isLoading = true;
        this.adminService.getAllUsers().subscribe({
            next: (data) => {
                this.users = data;
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    updateRole(userId: string, newRole: string): void {
        this.adminService.updateUserRole(userId, newRole).subscribe({
            next: () => {
                const user = this.users.find(u => u._id === userId);
                if (user) user.role = newRole as any;
            }
        });
    }

    deleteUser(userId: string): void {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            this.adminService.deleteUser(userId).subscribe({
                next: () => {
                    this.users = this.users.filter(u => u._id !== userId);
                }
            });
        }
    }
}
