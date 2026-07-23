import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]

    });

  }

  isLoading: boolean = false;

  // Getter for email field
  get email() {
    return this.loginForm.get('email');
  }

  // Getter for password field
  get password() {
    return this.loginForm.get('password');
  }

  login() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const loginData = this.loginForm.value;

    this.authService.login(loginData).subscribe({

      next: (response) => {
        this.isLoading = false;
        console.log(response);

        // Save token
        localStorage.setItem('token', response.user.token || '');

        // Save user details
        localStorage.setItem('user', JSON.stringify(response.user));

        this.toastService.success(response.message || 'Logged in successfully!');

        this.router.navigate(['/']);
      },

      error: (error) => {
        this.isLoading = false;
        console.error(error);
        this.toastService.error(error.error?.message || 'Login failed');
      }

    });

  }

}