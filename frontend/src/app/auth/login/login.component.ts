import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService
// import { HeaderComponent } from '../../shared/header/header.component'; // Import HeaderComponent
import { environment } from '../../../environments/environment'; // Ensure this has the correct API URL

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  passwordFieldType: string = 'password'; // To control password field visibility
  errorMessage: string = ''; // To display login errors
  // role: string | undefined; // Assume this is set based on the login process

  constructor(private router: Router, private authService: AuthService,
    //03-10
    // private headerComponent: HeaderComponent
  ) {} // Inject AuthService

  // Method to toggle password visibility
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  // Form submission logic
  onSubmit(form: NgForm) {
    const username = form.value.username; // Changed to 'username'
    const password = form.value.password;

    // Check if username and password are provided
    if (!username || !password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    // API call to authenticate the user using AuthService
    this.authService.login({ Username: username, Password: password }).subscribe(
      (response: any) => {
        console.log('Response:', response); // Log response
        const token = response.token;

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('userId', response.userId);
          // this.router.navigate(['/home']);

          //02-10
          localStorage.setItem('role', response.role); // Store the role in local storage
          // Check role and navigate accordingly
          // const role = response.role; // Assume the role is part of the response
          // if (role === 'Patient') {
          //   this.router.navigate(['/home']);
          // } else if (role === 'Doctor') {
          //   this.router.navigate(['/dashboard/doctor-dashboard']);
          // } else if (role === 'Admin') {
          //   this.router.navigate(['/dashboard/admin-dashboard']);
          // } else {
          //   this.errorMessage = 'Login failed: Unknown role.';
          // }

          // //03-10
          // // Update the header component state
          // this.headerComponent.isLoggedIn = true; // Set login state
          // this.headerComponent.fetchPatientName(); // Fetch the patient's name immediately after logging in

          this.navigateByRole(response.role);
        } else {
          this.errorMessage = 'Login failed: No token received.';
        }
      },
      (error) => {
        console.error('Login error:', error); // Log error for more detail
        this.errorMessage = 'Login failed: Invalid username or password.';
      }
    );
  }

  // Method to navigate based on role
  private navigateByRole(role: string) {
    if (role === 'Patient') {
      this.router.navigate(['/home']);
    } else if (role === 'Doctor') {
      this.router.navigate(['/dashboard/doctorprofile']);
    } else if (role === 'Admin') {
      this.router.navigate(['/dashboard/admin-dashboard']);
    } else {
      this.errorMessage = 'Login failed: Unknown role.';
    }
  }
  // Method to navigate to the signup page
  navigateToSignup() {
    this.router.navigate(['/auth/signup']);
  }

  onLogin() {
    const role = localStorage.getItem('userRole'); // Make sure to set this when the user logs in

    if (role) {
      this.authService.login(role); // Call the login method with the retrieved role
    } else {
      console.error('Login failed: No role found in local storage.');
    }
  }
}
