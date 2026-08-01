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

// ==========================================
// COMPONENT DECORATOR
// ==========================================
// This tells Angular that this TypeScript class is a Component.
@Component({
  selector: 'app-login',
  standalone: true, // It manages its own dependencies without an app.module.ts
  imports: [
    CommonModule,         // Gives us access to standard Angular directives like *ngIf
    ReactiveFormsModule,  // Required because we are using FormGroup and FormBuilder for our login form
    RouterLink,           // Allows us to use routerLink="..." in the HTML to navigate
    GoogleSigninButtonModule // Provides the Google Sign-in button component
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  // loginForm will hold the state, values, and validation status of our HTML form
  loginForm: FormGroup;
  isLoading: boolean = false;

  // ==========================================
  // CONSTRUCTOR (DEPENDENCY INJECTION)
  // ==========================================
  // When Angular creates this component, it looks at the constructor arguments and injects the requested services automatically.
  constructor(
    private fb: FormBuilder,         // Helper to create complex forms easily
    private authService: AuthService,  // Our custom service to talk to the Node backend
    private router: Router,          // Angular's routing service to change pages programmatically
    private toastService: ToastService, // Our custom service to show popup notifications
    private socialAuthService: SocialAuthService // Google auth service
  ) {

    // Initialize the form structure
    this.loginForm = this.fb.group({
      // email is a FormControl. Default value is empty string ''.
      email: [
        '',
        [
          Validators.required, // Must not be empty
          Validators.email     // Must be a valid email format (e.g. contains @)
        ]
      ],
      // password is a FormControl
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6) // Backend expects at least 6 characters
        ]
      ]
    });

  }

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      if (user && user.idToken) {
        this.isLoading = true;
        this.authService.googleLogin(user.idToken).subscribe({
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

  // ==========================================
  // GETTERS
  // ==========================================
  // These make it easier to access form controls in the HTML file for displaying error messages.
  // Example in HTML: <div *ngIf="email?.invalid && email?.touched">Invalid email!</div>
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // ==========================================
  // LOGIN ACTION
  // ==========================================
  // This is triggered by (ngSubmit)="login()" on the <form> tag in the HTML.
  login() {

    // 1. Guard Clause: If the user hasn't filled out the form correctly, stop them here.
    if (this.loginForm.invalid) {
      // markAllAsTouched() forces all the red error messages in the HTML to show up immediately
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    // 2. Extract the email and password from the form
    const loginData = this.loginForm.value;

    // 3. Make the API Call using the AuthService
    // authService.login() returns an Observable. We MUST call .subscribe() to actually send the HTTP request.
    this.authService.login(loginData).subscribe({

      // 4. NEXT BLOCK (Success)
      // Runs if the backend responds with a 200/201 status code
      next: (response) => {
        this.isLoading = false;

        // Show a green success popup
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

      // 5. ERROR BLOCK (Failure)
      // Runs if the backend responds with a 4xx or 5xx status code (e.g. 401 Unauthorized for wrong password)
      error: (error) => {
        this.isLoading = false;
        console.error(error);
        
        // Show a red error popup containing the exact error message the backend sent back
        this.toastService.error(error.error?.message || 'Login failed');
      }

    });

  }

}