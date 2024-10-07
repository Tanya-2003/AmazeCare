import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { FormBuilder, FormGroup } from '@angular/forms'; // For Form Handling
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DoctorserviceService } from '../../services/doctorservice.service';

import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar


@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent {
  showTime: boolean = false;
  appointmentForm: FormGroup;  // Define a FormGroup to handle the form data

  formSubmitted: boolean = false; // Track form submission status

  constructor(private fb: FormBuilder, private doctorservice : DoctorserviceService,private snackBar: MatSnackBar) {
    // Initialize the form with default values
    this.appointmentForm = this.fb.group({
      name: '',
      email: '',
      phoneNumber: '',
      preferredDate: '',
      preferredTime: '',
      doctorName: '',
      symptoms: ''
    });
  }

  showTimeField() {
    this.showTime = true; // Show the time input when a date is selected
  }

  // Method to handle form submission
  // submitForm() {
  //   // Extract values from the form
  //   const formData = this.appointmentForm.value;
    
  //   // Format date and time to match the API structure
  //   const formattedData = {
  //     ...formData,
  //     preferredDate: `${formData.preferredDate}T${formData.preferredTime}:00`
  //   };

  //   console.log("Sending data to API:", formattedData); // Log data for debugging

  //   // Use the service to make a POST request to the API
  //   this.doctorservice.createBooking(formattedData)
  //     .pipe(
  //       catchError(error => {
  //         console.error('Error occurred while creating the booking:', error);
  //         return of(`Error: ${error.message}`);
  //       })
  //     )
  //     .subscribe(response => {
  //       console.log('Response from API:', response);
  //       alert('Booking and Appointment created successfully!');
  //     });
  // }

  // submitForm() {
  //   // Extract values from the form
  //   const formData = this.appointmentForm.value;
    
  //   // Format date and time to match the API structure
  //   const formattedData = {
  //     ...formData,
  //     preferredDate: `${formData.preferredDate}T${formData.preferredTime}:00`
  //   };

  //   console.log("Sending data to API:", formattedData); // Log data for debugging

  //   // Use the service to make a POST request to the API
  //   this.doctorservice.createBooking(formattedData)
  //     .pipe(
  //       catchError(error => {
  //         console.error('Error occurred while creating the booking:', error);
  //         this.showNotification('Error occurred: ' + error.message);
  //         return of(`Error: ${error.message}`);
  //       })
  //     )
  //     .subscribe(response => {
  //       console.log('Response from API:', response);
  //       this.showNotification('Booking and Appointment created successfully!');
  //       this.formSubmitted = true; // Set form as submitted
  //       this.appointmentForm.reset(); // Reset the form after submission
  //     });
  // }

  submitForm() {
    const formData = this.appointmentForm.value;
  
    // Create the base data structure for submission
    const formattedData: any = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      preferredDate: `${formData.preferredDate}T00:00:00`,  // Date in "YYYY-MM-DDTHH:MM:SS" format
      symptoms: formData.symptoms,
      doctorName: formData.doctorName
    };
  
    // Only add `preferredTime` if it's provided
    if (formData.preferredTime) {
      formattedData.preferredTime = { ticks: this.convertTimeToTicks(formData.preferredTime) };
    }
  
    console.log("Sending formatted data to API:", formattedData);
  
    // Use the service to make a POST request to the API
    this.doctorservice.createBooking(formattedData)
      .pipe(
        catchError(error => {
          console.error('Error occurred while creating the booking:', error);
          return of(`Error: ${error.message}`);
        })
      )
      .subscribe(response => {
        console.log('Response from API:', response);
        this.formSubmitted = true;  // Show the success message
      });
  }
  
  convertTimeToTicks(time: string): number {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    // Calculate the total ticks: (hours * 3600 + minutes * 60 + seconds) * 10,000,000
    return ((hours * 3600) + (minutes * 60) + seconds) * 10000000;
  }
  

  // Method to show notifications
  showNotification(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Notification duration in milliseconds
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  validateDate(event: Event) {
    const target = event.target as HTMLInputElement; // Cast to HTMLInputElement
    const date = target.value; // Now we can safely get the value
  
    const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    if (!regex.test(date)) {
      console.error('Invalid date format. Expected YYYY-MM-DD');
      // You can show a user-friendly error message here
    }
  }
  
  validateTime(event: Event) {
    const target = event.target as HTMLInputElement; // Cast to HTMLInputElement
    const time = target.value; // Now we can safely get the value
  
    const regex = /^\d{2}:\d{2}:\d{2}$/; // HH:MM:SS format
    if (!regex.test(time)) {
      console.error('Invalid time format. Expected HH:MM:SS');
      // You can show a user-friendly error message here
    }
  }
}
