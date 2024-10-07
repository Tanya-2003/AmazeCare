import { ChangeDetectorRef, Component } from '@angular/core';
import { PatientDashboardComponent } from '../patient-dashboard.component';
import { HttpClient } from '@angular/common/http';
import { Patient } from '../../../models/patient.model';
import { NgForm, NgModel } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-patientprofile',
  templateUrl: './patientprofile.component.html',
  styleUrl: './patientprofile.component.scss'
})
export class PatientprofileComponent {
  patient: Patient = {
    patientId: undefined, 
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    address: '',
    bloodGroup: '',
    knownAllergies: '',
    currentMedication: '',
    username:'',
    password:'',
    image: '',
    patientName:'',
  };

  isEditMode = false;
  originalPatientData: Patient | null = null;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  isLoggedIn: boolean = false;
  patientName: string | null = '';
  userId: string | null = '';

  patientImageMapping: { [key: string]: string } = {
    'Anthony': 'assets/user/anthony.jpg',
    'Benedict': 'assets/user/benedict.jpeg',
    'Colin': 'assets/user/colin.jpg',
    'Daphne': 'assets/user/daphne.jpeg',
    'Eloise': 'assets/user/eloise.jpg',
    'Francesca': 'assets/user/francesca.jpeg',
    'Gregory': 'assets/user/gregory.jpeg',
    'Hyacinth': 'assets/user/hyacinth.jpeg',
    'Penelope': 'assets/user/penelope.jpg',
    'Philip': 'assets/user/philip.png',
    'Simon': 'assets/user/simon.jpg',
  };

  constructor(private http: HttpClient, private patientService: AuthService, private adminService: AdminService,private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchPatientProfile();
  }

  fetchPatientProfile() {
    const patientId = localStorage.getItem('userId'); // Fetching patient ID from local storage
    if (patientId) {
      this.http.get<Patient>(`https://localhost:7260/api/Patients/Profile/${patientId}`)
        .subscribe((data) => {
          if (data.dateOfBirth) {
            data.dateOfBirth = data.dateOfBirth.split('T')[0];
          }
          // Map image based on firstName using patientImageMapping
          data.image = this.patientImageMapping[data.firstName] || 'assets/default-patient-image.png';
          
          this.patient = data;

          this.patientName = `${data.firstName} ${data.lastName}`;

        });
    }
  }

  editProfile() {
    this.isEditMode = true;
    this.originalPatientData = { ...this.patient }; // Clone patient data
  }

  saveProfile(form: NgForm) {
    if (form.valid) {
      const patientId = localStorage.getItem('userId'); // Fetching patient ID from local storage
    if (patientId) {
      this.patientService.updateProfile(+patientId, this.patient).subscribe(
        (response) => {
          // Handle successful response
          this.isEditMode = false;
          this.showMessage('Profile updated successfully!', true);
          this.errorMessage = null; // Clear any previous error messages
          // Optionally clear the form or fetch the updated data again
          this.fetchPatientProfile();
        },
        (error) => {
          // Handle error response
          console.error('Update failed', error);
          this.showMessage('Failed to update profile. Please try again.', false);;
          this.successMessage = null; // Clear any previous success messages
        }
      );
    } else {
      this.showMessage('Please fill in all required fields correctly.',false);
      this.successMessage = null; // Clear any previous success messages
    }
  }
}

  cancelEdit() {
    this.isEditMode = false;
    if (this.originalPatientData) {
      this.patient = { ...this.originalPatientData };
    }
  }

  validateDate(dob: NgModel) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Regex for yyyy-mm-dd
    if (dob.value && !datePattern.test(dob.value)) {
      dob.control.setErrors({ pattern: true });
    }
  }
  
  showMessage(message: string, isSuccess: boolean) {
    if (isSuccess) {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = null; // Clear the message after 3 seconds
      }, 2000);
    } else {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null; // Clear the message after 3 seconds
      }, 2000);
    }
  }

  fetchPatientName(): void {
    if (this.userId) {
      const numericUserId = Number(this.userId);  // Convert `userId` to a number
      this.adminService.getPatientById(numericUserId).subscribe(
        (patient) => {
          this.patientName = `${patient.firstName} ${patient.lastName}`;
          this.changeDetector.detectChanges(); // Trigger change detection manually
        },
        (error) => {
          console.error('Failed to fetch patient name', error);
        }
      );
    }
  }
}
