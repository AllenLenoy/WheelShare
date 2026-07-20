import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CarListComponent } from './vehicles/car-list/car-list.component';
import { CarDetailsComponent } from './vehicles/car-details/car-details.component';
import { BookCarComponent } from './booking/book-car/book-car.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  // auth
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  // vehicles
  { path: 'vehicles', component: CarListComponent },
  { path: 'vehicles/:id', component: CarDetailsComponent },

  // booking
  { path: 'book/:carId', component: BookCarComponent },

  // 404 — keep this last
  { path: '**', component: NotFoundComponent }
];