import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Adjust the import path if necessary

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';  
  passwordsMatch: boolean = true;  
  errorMessage: string = ''; // To display registration errors

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(form: NgForm) {
    const { firstName, lastName, username, email, password, confirmPassword, dateOfBirth, gender } = form.value;

    // Basic validation
    if (!form.valid) {
      console.error("Form is invalid");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      this.passwordsMatch = false;  
      console.error("Passwords do not match");
      return;
    }

    this.passwordsMatch = true;

    // Create the patient object
    //const dob = new Date(dateOfBirth); // Convert date of birth string to Date object

    const dob = new Date(dateOfBirth);
    const formattedDateOfBirth = `${dob.getFullYear()}-${String(dob.getMonth() + 1).padStart(2, '0')}-${String(dob.getDate()).padStart(2, '0')}`;

    const patientData = {
      firstName,
    lastName,
    dateOfBirth: formattedDateOfBirth, // Set formatted date of birth
    gender, // Using value from form
    email, // Email entered by user
    address: form.value.address, // Address entered by user
    bloodGroup: form.value.bloodGroup, // Blood group entered by user
    knownAllergies: form.value.knownAllergies, // Known allergies entered by user
    currentMedication: form.value.currentMedication, // Current medication entered by user
    username, // Using username entered by user
    password, // Only send the actual password
    // imageUrl: "default-image-url.png" // Add a default image URL or set to null if your DB allows

    };
    console.log("Sending data to API:", JSON.stringify(patientData, null, 2));

    // Call the registration service
    this.authService.register(patientData).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/auth/login']); // Navigate to login page after successful registration
      },
      (error) => {
        console.error('Registration error:', error);
        this.errorMessage = 'Registration failed. Please try again.'; // Set error message
      }
    );
  }

  // Toggle password visibility for the password field
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  // Toggle password visibility for the confirm password field
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }
}
