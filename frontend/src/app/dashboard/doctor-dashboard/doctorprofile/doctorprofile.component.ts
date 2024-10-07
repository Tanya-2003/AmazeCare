import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DoctorserviceService } from '../../../services/doctorservice.service';
import { DoctorRegisterDTO } from '../../../models/DoctorRegisterDTO.model'; // Adjust the path as necessary

@Component({
  selector: 'app-doctorprofile',
  templateUrl: './doctorprofile.component.html',
  styleUrls: ['./doctorprofile.component.css']
})
export class DoctorprofileComponent implements OnInit {
  doctorProfileForm!: FormGroup;
  doctorId!: number;
  info: DoctorRegisterDTO | null = null; // Store fetched doctor profile data
  isEditing: boolean = false; // For toggling edit mode
  status: string = 'Online'; // Default status value
  errorMessage: string | null = null; // For error notifications
  successMessage: string | null = null; // For success notifications

  doctorImageMapping: { [key: string]: string } = {
    'Shaun': 'assets/doctor-card/shawn.jpeg',
    'Claire': 'assets/doctor-card/claire.jpeg',
    'Neil': 'assets/doctor-card/niel.jpg',
    'Audrey': 'assets/doctor-card/audrey.jpg',
    'Marcus': 'assets/doctor-card/marcus.jpeg',
    'Aaron': 'assets/doctor-card/aaron.jpg',
    'Morgan': 'assets/doctor-card/morgan.jpeg',
    'Jordan': 'assets/doctor-card/jordan.jpeg',
    'Alex': 'assets/doctor-card/alex.jpeg',
    'Lea': 'assets/doctor-card/lea.jpeg',
    'Carly': 'assets/doctor-card/carly.jpeg',
    'Jessica': 'assets/doctor-card/jessica.jpeg',
    'Andrews': 'assets/doctor-card/andrews.jpeg',
    'Tamara': 'assets/doctor-card/tamara.jpeg',
    'Chris': 'assets/doctor-card/chris.jpeg',
    'Sarah': 'assets/doctor-card/sarah.jpeg',
    'Bobby': 'assets/doctor-card/bobby.jpeg',
    'Sophie': 'assets/doctor-card/sophie.jpeg',
    'Ethan': 'assets/doctor-card/ethan.jpeg',
    'Gina': 'assets/doctor-card/gina.jpg',
    'Luke': 'assets/doctor-card/luke.jpeg',
    'Rachel': 'assets/doctor-card/rachel.jpg',
  };

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorserviceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Retrieve doctor ID from local storage
    this.doctorId = parseInt(localStorage.getItem('userId') || '0', 10);
    console.log('Doctor ID from Local Storage:', this.doctorId); // Check what ID is being retrieved

    // Initialize the form and load profile
    this.initializeForm();
    this.loadDoctorProfile(this.doctorId);
  }

  // Method to get the image URL based on doctor's first name
  getDoctorImage(): string {
    const firstName = this.info?.firstName; // Using optional chaining
    if (firstName && this.doctorImageMapping[firstName]) { // Check if firstName is defined and exists in the mapping
      return this.doctorImageMapping[firstName];
    }
    return 'assets/default-doctor-image.jpg'; // Provide a default image if no match is found
  }

  // Initialize the form with form controls and their validators
  initializeForm(): void {
    this.doctorProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required], // Added date of birth
      gender: [{ value: '', disabled: true }, Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      secondaryPhoneNumber: ['', Validators.pattern(/^[0-9]{10}$/)],
      email: ['', [Validators.required, Validators.email]],
      specialisation: [{ value: '', disabled: true }, Validators.required],
      licenseNumber: [{ value: '', disabled: true }, Validators.required],
      username: [{ value: '', disabled: true },['', Validators.required]],
      password: ['', Validators.required],
      yearsOfExperience: [{ value: '', disabled: true }, [Validators.required, Validators.min(0)]],
    });
  }

  // Fetch the doctor profile based on doctorId
  loadDoctorProfile(doctorId: number): void {
    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (data: DoctorRegisterDTO) => {
        console.log('Doctor Profile Data:', data); // Check the response here
        this.info = data;
        this.populateForm(data);
      },
      error: (error) => {
        console.error('Error fetching doctor profile:', error);
        this.errorMessage = 'Failed to load doctor profile. Please try again later.'; // Set error message
        this.clearMessagesAfterTimeout(); // Clear messages after timeout
      }
    });
  }

  // Populate the form with fetched profile data
  populateForm(data: DoctorRegisterDTO): void {
    this.doctorProfileForm.patchValue({
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth, // Patch the date of birth
      gender: data.gender,
      phoneNumber: data.phoneNumber,
      secondaryPhoneNumber: data.secondaryPhoneNumber,
      email: data.email,
      specialisation: data.specialisation,
      licenseNumber: data.licenseNumber,
      username: data.username,
      password: data.password,
      yearsOfExperience: data.yearsOfExperience,
    });
  }

  // Toggle edit mode
  editProfile(): void {
    this.isEditing = true;
    this.errorMessage = null; 
    this.successMessage = null// Clear any existing notifications
  }

  saveProfile(): void {
    if (this.doctorProfileForm.valid) {
        const updatedProfile: DoctorRegisterDTO = { ...this.doctorProfileForm.getRawValue() };
        console.log('Updated Profile Data:', updatedProfile); // Ensure password is logged here

        this.doctorService.updateDoctor(this.doctorId, updatedProfile).subscribe({
            next: () => {
                this.isEditing = false;
                this.loadDoctorProfile(this.doctorId);
                this.successMessage = 'Profile updated successfully!';
                this.errorMessage = null;
                this.clearMessagesAfterTimeout();
            },
            error: (error) => {
                console.error('Error updating doctor profile:', error);
                this.errorMessage = 'Failed to update profile. Please check your input and try again.';
                this.clearMessagesAfterTimeout();
            }
        });
    } else {
        console.error('Form is invalid. Please check the fields and try again.');
        this.errorMessage = 'Form is invalid. Please check the fields and try again.';
        this.clearMessagesAfterTimeout();
    }
}

  // Cancel edit and revert changes
  cancelEdit(): void {
    this.isEditing = false;
    if (this.info) {
      this.populateForm(this.info); // Revert to the original data
    }
    this.errorMessage = null; // Clear any error messages
    this.successMessage = null; // Clear any success messages
  }

  // Utility function to clear notifications after a timeout
  clearMessagesAfterTimeout(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 2000); 
  }

}
