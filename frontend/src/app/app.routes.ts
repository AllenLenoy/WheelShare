import { Routes } from '@angular/router';

// ==========================================
// EAGERLY LOADED COMPONENTS
// ==========================================
// These components are imported at the top of the file. 
// This means their JavaScript code is bundled into the main `main.js` file and downloaded as soon as the user opens the website.
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

// ==========================================
// ROUTE GUARDS
// ==========================================
// Guards act as bouncers. They run before a route is loaded to check if the user has permission to view it.
import { authGuard } from './guards/auth.guard';
import { ownerGuard } from './guards/owner.guard';
import { adminGuard } from './guards/admin.guard';

// ==========================================
// ROUTE DEFINITIONS
// ==========================================
export const routes: Routes = [
    // 1. PUBLIC ROUTES (No login required)
    { path: '', component: HomeComponent },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    { path: 'vehicles', component: CarListComponent },
    
    // Parameterized Route: The ':id' is dynamic. If the URL is /vehicles/123, the component can read '123' using ActivatedRoute.
    { path: 'vehicles/:id', component: CarDetailsComponent },

    // 2. PROTECTED ROUTES (Requires Login)
    // The `canActivate: [authGuard]` array tells Angular to run the authGuard function. 
    // If authGuard returns false (i.e. user is not logged in), the router cancels the navigation.
    { path: 'book/:carId', component: BookCarComponent, canActivate: [authGuard] },
    { path: 'customer/dashboard', component: CustomerDashboardComponent, canActivate: [authGuard] },
    { path: 'customer/bookings', component: BookingHistoryComponent, canActivate: [authGuard] },
    { path: 'customer/profile', component: ProfileComponent, canActivate: [authGuard] },

    // 3. LAZY LOADED ROUTES (Owner Section)
    // Lazy loading is a performance optimization.
    // Instead of importing the Owner components at the top of this file, we use `loadComponent: () => import(...)`.
    // This creates a separate JavaScript "chunk" for the owner section. The browser only downloads this chunk if an Owner actually navigates to '/owner'.
    {
        path: 'owner',
        canActivate: [ownerGuard], // Protects the entire /owner/* section
        children: [
            { path: 'dashboard', loadComponent: () => import('./owner/dashboard/dashboard.component').then(m => m.OwnerDashboardComponent) },
            { path: 'vehicles', loadComponent: () => import('./owner/vehicles/vehicles.component').then(m => m.OwnerVehiclesComponent) },
            { path: 'add-vehicle', loadComponent: () => import('./owner/add-vehicle/add-vehicle.component').then(m => m.AddVehicleComponent) },
            { path: 'edit-vehicle/:id', loadComponent: () => import('./owner/edit-vehicle/edit-vehicle.component').then(m => m.EditVehicleComponent) },
            { path: 'bookings', loadComponent: () => import('./owner/bookings/bookings.component').then(m => m.OwnerBookingsComponent) },
            
            // Default child route: If they just type '/owner', redirect them to '/owner/dashboard'
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' } 
        ]
    },

    // 4. LAZY LOADED ROUTES (Admin Section)
    {
        path: 'admin',
        canActivate: [adminGuard], // Protects the entire /admin/* section
        children: [
            { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent) },
            { path: 'users', loadComponent: () => import('./admin/users/users.component').then(m => m.AdminUsersComponent) },
            { path: 'vehicles', loadComponent: () => import('./admin/vehicles/vehicles.component').then(m => m.AdminVehiclesComponent) },
            { path: 'bookings', loadComponent: () => import('./admin/bookings/bookings.component').then(m => m.AdminBookingsComponent) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // 5. WILDCARD ROUTE (404 Not Found)
    // The '**' path catches EVERYTHING that hasn't matched a route defined above.
    // IMPORTANT: This must always be the very last route in the array, otherwise it will catch valid URLs too.
    { path: '**', component: NotFoundComponent }
];