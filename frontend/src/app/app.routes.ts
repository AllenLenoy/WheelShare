import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CarListComponent } from './vehicles/car-list/car-list.component';
import { CarDetailsComponent } from './vehicles/car-details/car-details.component';
import { BookCarComponent } from './booking/book-car/book-car.component';
import { BookingHistoryComponent } from './booking/booking-history/booking-history.component';
import { CustomerDashboardComponent } from './customer/dashboard/dashboard.component';
import { ProfileComponent } from './customer/profile/profile.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { authGuard } from './guards/auth.guard';
import { ownerGuard } from './guards/owner.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    // Public
    { path: '', component: HomeComponent },

    // Auth
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },

    // Vehicles (public)
    { path: 'vehicles', component: CarListComponent },
    { path: 'vehicles/:id', component: CarDetailsComponent },

    // Booking (auth required)
    { path: 'book/:carId', component: BookCarComponent, canActivate: [authGuard] },

    // Customer
    { path: 'customer/dashboard', component: CustomerDashboardComponent, canActivate: [authGuard] },
    { path: 'customer/bookings', component: BookingHistoryComponent, canActivate: [authGuard] },
    { path: 'customer/profile', component: ProfileComponent, canActivate: [authGuard] },

    // Owner (lazy loaded)
    {
        path: 'owner',
        canActivate: [ownerGuard],
        children: [
            { path: 'dashboard', loadComponent: () => import('./owner/dashboard/dashboard.component').then(m => m.OwnerDashboardComponent) },
            { path: 'vehicles', loadComponent: () => import('./owner/vehicles/vehicles.component').then(m => m.OwnerVehiclesComponent) },
            { path: 'add-vehicle', loadComponent: () => import('./owner/add-vehicle/add-vehicle.component').then(m => m.AddVehicleComponent) },
            { path: 'edit-vehicle/:id', loadComponent: () => import('./owner/edit-vehicle/edit-vehicle.component').then(m => m.EditVehicleComponent) },
            { path: 'bookings', loadComponent: () => import('./owner/bookings/bookings.component').then(m => m.OwnerBookingsComponent) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // Admin (lazy loaded)
    {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
            { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent) },
            { path: 'users', loadComponent: () => import('./admin/users/users.component').then(m => m.AdminUsersComponent) },
            { path: 'vehicles', loadComponent: () => import('./admin/vehicles/vehicles.component').then(m => m.AdminVehiclesComponent) },
            { path: 'bookings', loadComponent: () => import('./admin/bookings/bookings.component').then(m => m.AdminBookingsComponent) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // 404
    { path: '**', component: NotFoundComponent }
];