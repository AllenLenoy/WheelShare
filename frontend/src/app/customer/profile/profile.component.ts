import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

    user: User | null = null;
    editName = '';
    editEmail = '';
    oldPassword = '';
    newPassword = '';
    confirmPassword = '';

    isEditing = false;
    isSaving = false;
    isChangingPassword = false;
    isSavingPassword = false;

    profileMessage = '';
    profileError = '';
    passwordMessage = '';
    passwordError = '';

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.user = this.authService.getUser();
        if (this.user) {
            this.editName = this.user.name;
            this.editEmail = this.user.email;
        }
    }

    get userInitial(): string {
        return this.user?.name?.charAt(0)?.toUpperCase() || 'U';
    }

    startEditing(): void {
        this.isEditing = true;
        this.profileMessage = '';
        this.profileError = '';
    }

    cancelEditing(): void {
        this.isEditing = false;
        if (this.user) {
            this.editName = this.user.name;
            this.editEmail = this.user.email;
        }
    }

    saveProfile(): void {
        this.isSaving = true;
        this.profileError = '';
        this.profileMessage = '';

        this.authService.updateProfile({
            name: this.editName,
            email: this.editEmail
        }).subscribe({
            next: (updated) => {
                this.user = this.authService.getUser();
                this.isEditing = false;
                this.isSaving = false;
                this.profileMessage = 'Profile updated successfully!';
            },
            error: (err) => {
                this.profileError = err.error?.message || 'Failed to update profile';
                this.isSaving = false;
            }
        });
    }

    togglePasswordForm(): void {
        this.isChangingPassword = !this.isChangingPassword;
        this.passwordMessage = '';
        this.passwordError = '';
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
    }

    savePassword(): void {
        if (this.newPassword !== this.confirmPassword) {
            this.passwordError = 'Passwords do not match';
            return;
        }
        if (this.newPassword.length < 6) {
            this.passwordError = 'Password must be at least 6 characters';
            return;
        }

        this.isSavingPassword = true;
        this.passwordError = '';

        this.authService.changePassword({
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
        }).subscribe({
            next: () => {
                this.passwordMessage = 'Password changed successfully!';
                this.isChangingPassword = false;
                this.isSavingPassword = false;
            },
            error: (err) => {
                this.passwordError = err.error?.message || 'Failed to change password';
                this.isSavingPassword = false;
            }
        });
    }
}
