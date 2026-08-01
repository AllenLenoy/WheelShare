import { Component, OnInit } from '@angular/core';
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
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    GoogleSigninButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private socialAuthService: SocialAuthService
  ) {

    this.registerForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

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
      ],

      role: [
        'customer',
        [
          Validators.required
        ]
      ]

    });

  }

  isLoading: boolean = false;

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      if (user && user.idToken) {
        this.isLoading = true;
        const selectedRole = this.registerForm?.get('role')?.value || 'customer';
        this.authService.googleLogin(user.idToken, selectedRole).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.toastService.success(response.message || 'Logged in successfully!');
            const role = response.user?.role;
            if (role === 'admin') {
              this.router.navigate(['/admin/dashboard']);
            } else if (role === 'owner') {
              this.router.navigate(['/owner/dashboard']);
            } else {
              this.router.navigate(['/customer/dashboard']);
            }
          },
          error: (error) => {
            this.isLoading = false;
            console.error(error);
            this.toastService.error(error.error?.message || 'Google Login failed');
          }
        });
      }
    });
  }

  register() {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const registerData = this.registerForm.value;

    this.authService.register(registerData).subscribe({

      next: (response) => {
        this.isLoading = false;

        this.toastService.success(response.message || 'Registration successful!');

        const role = response.user?.role;
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'owner') {
          this.router.navigate(['/owner/dashboard']);
        } else {
          this.router.navigate(['/customer/dashboard']);
        }
      },

      error: (error) => {
        this.isLoading = false;
        console.error(error);
        this.toastService.error(error.error?.message || 'Registration Failed');
      }

    });

  }

}
