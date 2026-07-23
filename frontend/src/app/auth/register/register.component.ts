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
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
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
        console.log(response);

        // Save token
        localStorage.setItem('token', response.user.token || '');

        // Save user details
        localStorage.setItem('user', JSON.stringify(response.user));

        this.toastService.success(response.message || 'Registration successful!');

        this.router.navigate(['/']);
      },

      error: (error) => {
        this.isLoading = false;
        console.error(error);
        this.toastService.error(error.error?.message || 'Registration Failed');
      }

    });

  }

}
