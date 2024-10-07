import { Component, OnInit } from '@angular/core';
import { Patient } from '../../../models/patient.model';
import { Appointment } from '../../../models/appointment.model';
import { AdminService } from '../../../services/admin.service';
import { MedicalRecord } from '../../../models/medicalRecord.model';

@Component({
  selector: 'app-admin-patient',
  templateUrl: './admin-patient.component.html',
  styleUrls: ['./admin-patient.component.scss']
})
export class AdminPatientComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchQuery = '';
  sortField = '';
  sortDirection = 1;
  currentPage = 1;
  itemsPerPage = 5;
  showForm: boolean = false; // Add this property
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode: boolean = false;

  newPatient: Patient = {} as Patient;
  isAddMode = false;  // Used to track if we are in add mode
  selectedIndex: number = -1; // Initialize to an invalid index
  showDeleteConfirm = false;
  currentPatientName = '';   // Holds the name of the patient to be deleted
  patientToDeleteName: { firstName: string; lastName: string } | null = null;
  
  constructor(private patientService: AdminService) {}

  ngOnInit(): void {
    this.fetchPatients();
  }

  fetchPatients(): void {
    this.patientService.getPatients().subscribe(
      (patients: Patient[]) => {
        this.patients = patients.map((patient) => ({
          ...patient,
          age: this.calculateAge(patient.dateOfBirth),
        }));
  
        // Fetch medical records for each patient using the corrected `patientId`
        this.patients.forEach((patient, index) => {
          if (patient.patientId) {
            this.patientService.getMedicalRecordsByPatientId(patient.patientId).subscribe(
              (records) => {
                this.fetchAppointmentDates(records, index);
              },
              (error) => {
                console.error(`Error fetching records for patient ${patient.patientId}`, error);
              }
            );
          }
        });
  
        this.filteredPatients = [...this.patients];
      },
      (error) => {
        console.error('Error fetching patients', error);
      }
    );
  }
  
  getMostRecentDiagnosis(records: MedicalRecord[]): string {
    if (records.length === 0) return 'No Diagnosis Available';
  
    // Sort by appointmentDate if it exists; handle undefined cases with a fallback date
    const sortedRecords = records.sort(
      (a, b) => 
        new Date(b.appointmentDate ?? '1970-01-01').getTime() - 
        new Date(a.appointmentDate ?? '1970-01-01').getTime()
    );
  
    return sortedRecords[0].diagnosis || 'No Diagnosis Available';
  }
  
  fetchAppointmentDates(records: MedicalRecord[], patientIndex: number): void {
    const recordRequests = records.map((record) =>
      this.patientService.getAppointmentById(record.appointmentId).toPromise()
    );
  
    Promise.all(recordRequests).then(
      (appointments) => {
        // Map the appointment date to each record
        records.forEach((record, index) => {
          const appointment = appointments[index];
          if (appointment) {
            record.appointmentDate = appointment.appointmentDate;  // Ensure appointment is not null
          }
        });
  
        // Set the diagnosis field in the patient using the most recent appointment date
        this.patients[patientIndex].diagnosis = this.getMostRecentDiagnosis(records);
        this.filteredPatients = [...this.patients];
      },
      (error) => console.error('Error fetching appointment details', error)
    );
  }  
  
  // Function to calculate age based on date of birth
  calculateAge(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const ageDifferenceMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifferenceMs); // Epoch date format: Jan 1, 1970, + age difference
    return Math.abs(ageDate.getUTCFullYear() - 1970); // Calculate the full years since birth
  }  

  openAddPatientForm(): void {
    this.activateAddMode(); // Call the existing method to set up the form for adding a patient
  }

  // Open modal for adding a new patient
  activateAddMode(): void {
    this.isAddMode = true;
    this.isEditMode = false;
    this.newPatient = {} as Patient;
    this.showForm = true; // Show the form
  }

  // Open modal for editing an existing patient
  // editPatientByName(firstName: string, lastName: string): void {
  //   this.isEditMode = true;
  //   this.isAddMode = false;

  //   // Find the patient by first name and last name
  //   const patientIndex = this.filteredPatients.findIndex(
  //     (patient) => patient.firstName.toLowerCase() === firstName.toLowerCase() && patient.lastName.toLowerCase() === lastName.toLowerCase()
  //   );

  //   if (patientIndex !== -1) {
  //     this.selectedIndex = patientIndex;
  //     this.newPatient = { ...this.filteredPatients[patientIndex] }; // Spread to avoid reference issues
  //     this.showForm = true; // Show the form for editing
  //   } else {
  //     this.errorMessage = `No patient found with the name: ${firstName} ${lastName}`;
  //     this.autoClearMessage(); // Automatically clear messages
  //   }
  // }

  editPatientByName(firstName: string, lastName: string): void {
    this.isEditMode = true;
    this.isAddMode = false;
  
    // Debugging: Log the patient's name
    console.log(`Editing patient: ${firstName} ${lastName}`);
    
    // Find the patient by first name and last name
    const patientIndex = this.filteredPatients.findIndex(
      (patient) => patient.firstName.toLowerCase() === firstName.toLowerCase() && patient.lastName.toLowerCase() === lastName.toLowerCase()
    );
  
    if (patientIndex !== -1) {
      this.selectedIndex = patientIndex;
      this.newPatient = { ...this.filteredPatients[patientIndex] }; // Spread to avoid reference issues
      this.showForm = true; // Show the form for editing
      this.errorMessage = null;
    } else {
      console.error(`No patient found with the name: ${firstName} ${lastName}`);
      this.errorMessage = `No patient found with the name: ${firstName} ${lastName}`;
      this.autoClearMessage(); // Automatically clear messages
    }
  }
  

  // Open delete confirmation modal
  confirmDeletePatient(firstName: string, lastName: string) {
    this.showDeleteConfirm = true;  // Show the delete confirmation modal
    this.currentPatientName = `${firstName} ${lastName}`;
  }

  // closeForm(): void {
  //   this.showForm = false; // Hide the form
  //   this.fetchPatients(); // Re-fetch patients to update the table
  // }

  closeForm(): void {
    this.showForm = false; // Set to `false` to hide the form
    this.isAddMode = false; // Reset add mode
    this.isEditMode = false; // Reset edit mode
    this.newPatient = {} as Patient; // Clear the patient form
    this.selectedIndex = -1; // Reset the selected index
  }

  cancelDelete() {
    this.showDeleteConfirm = false;  // Hide the confirmation modal
    this.currentPatientName = '';
  }

  // Save the new or edited patient data
  // savePatient(form: any): void {
  //   if (form.valid) {
  //     if (this.isAddMode) {
  //       // Adding a new patient logic...
  //     } else if (this.isEditMode && this.newPatient.patientId !== undefined) {
  //       // Update existing patient
  //       this.patientService.updatePatient(this.newPatient.patientId, this.newPatient).subscribe(
  //         () => {
  //           this.patients[this.selectedIndex] = { ...this.newPatient }; // Spread to avoid reference issues
  //           this.filteredPatients = [...this.patients]; // Refresh filtered list
  //           this.successMessage = 'Patient updated successfully!';
  //           this.errorMessage = null;
  //           this.isEditMode = false;
  //           this.closeForm(); // Close the form after saving
  //           this.autoClearMessage(); // Automatically clear messages
  //         },
  //         (error) => {
  //           console.error('Error updating patient', error);
  //           this.successMessage = null;
  //           this.errorMessage = 'Failed to update patient.';
  //           this.autoClearMessage(); // Automatically clear messages
  //         }
  //       );
  //     }
  //   }
  // }

  savePatient(form: any): void {
    if (form.valid) {
      if (this.isAddMode) {
        // Adding a new patient
        console.log('Adding patient:', this.newPatient); // Debug log
        this.patientService.addPatient(this.newPatient).subscribe(
          (addedPatient) => {
            this.patients.push(addedPatient); // Add the new patient to the list
            this.filteredPatients = [...this.patients]; // Refresh the filtered list
            this.successMessage = 'Patient added successfully!';
            this.errorMessage = null;
            this.closeForm(); // Close the form after saving
            this.autoClearMessage(); // Automatically clear messages
          },
          (error) => {
            console.error('Error adding patient:', error); // Log the error
            this.successMessage = null;
            this.errorMessage = 'Failed to add patient.';
            this.autoClearMessage(); // Automatically clear messages
          }
        );
      } else if (this.isEditMode && this.newPatient.patientId !== undefined) {
        // Updating existing patient
        console.log('Updating patient:', this.newPatient); // Debug log
        this.patientService.updatePatient(this.newPatient.patientId, this.newPatient).subscribe(
          () => {
            // Update the patient in the list
            this.patients[this.selectedIndex] = { ...this.newPatient };
            this.filteredPatients = [...this.patients]; // Refresh the filtered list
            this.successMessage = 'Patient updated successfully!';
            this.errorMessage = null;
            this.isEditMode = false;
            this.closeForm(); // Close the form after saving
            this.autoClearMessage(); // Automatically clear messages
          },
          (error) => {
            console.error('Error updating patient:', error); // Log the error
            this.successMessage = null;
            this.errorMessage = 'Failed to update patient.';
            this.autoClearMessage(); // Automatically clear messages
          }
        );
      }
    } else {
      console.warn('Form is not valid. Please check the input fields.');
    }
  }
  
  autoClearMessage(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 1500); // Clear messages after 1.5 seconds
  } 

  // Delete a patient after confirmation 
  deletePatient(): void {
    if (this.patientToDeleteName) {
      this.deletePatientByName(
        this.patientToDeleteName.firstName,
        this.patientToDeleteName.lastName
      );
      this.showDeleteConfirm = false;
      // this.patientToDeleteName = null;
      this.showDeleteConfirm = false;
      this.currentPatientName = '';
    }
  }

  deletePatientByName(firstName: string, lastName: string): void {
    const patientIndex = this.filteredPatients.findIndex(
      (patient) =>
        patient.firstName.toLowerCase() === firstName.toLowerCase() &&
        patient.lastName.toLowerCase() === lastName.toLowerCase()
    );

    if (patientIndex === -1) {
      this.errorMessage = `No patient found with the name: ${firstName} ${lastName}`;
      this.autoClearMessage();
      return;
    }

    const patientIdToDelete = this.filteredPatients[patientIndex].patientId;

    if (patientIdToDelete !== null && patientIdToDelete !== undefined) {
      this.patientService.deletePatient(patientIdToDelete).subscribe(
        () => {
          this.patients = this.patients.filter((patient) => patient.patientId !== patientIdToDelete);
          this.filteredPatients = [...this.patients];
          this.successMessage = `Patient ${firstName} ${lastName} deleted successfully!`;
          this.errorMessage = null;
          this.autoClearMessage();
        },
        (error) => {
          console.error('Error deleting patient', error);
          this.successMessage = null;
          this.errorMessage = `Failed to delete patient ${firstName} ${lastName}.`;
          this.autoClearMessage();
        }
      );
    } else {
      this.errorMessage = `Patient ID is invalid for: ${firstName} ${lastName}`;
      this.autoClearMessage();
    }
  }

  // Cancel the deletion process
  cancelEdit(): void {
    this.isAddMode = false;
    this.isEditMode = false;
  }

  // Search functionality
  searchPatients() {
    this.filterPatients();
  }

  // Sort by a field (in this case, firstName or other fields if needed)
  sortPatients(field: string) {
    if (this.sortField === field) {
      this.sortDirection = -this.sortDirection; // Toggle sort direction for the same field
    } else {
      this.sortField = field;
      this.sortDirection = 1; // Reset to ascending when switching fields
    }
    this.filterPatients();
  }

  // Filter and sort patients based on search query and sort field
  filterPatients() {
    let filtered = [...this.patients];

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(query) ||
          patient.lastName.toLowerCase().includes(query)
      );
    }

    if (this.sortField) {
      filtered.sort((a, b) => {
        const aValue = (a as any)[this.sortField]?.toLowerCase() || ''; // Get the field value and handle undefined cases
        const bValue = (b as any)[this.sortField]?.toLowerCase() || '';

        if (aValue > bValue) return this.sortDirection;
        if (aValue < bValue) return -this.sortDirection;
        return 0;
      });
    }

    this.filteredPatients = filtered;
    this.currentPage = 1; // Reset to the first page after sorting/searching
  }

  // Get paginated data
  getPaginatedPatients() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPatients.slice(startIndex, endIndex);
  }

  // Pagination controls
  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      console.log(`Current page after next: ${this.currentPage}`); // Log current page
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      console.log(`Current page after previous: ${this.currentPage}`); // Log current page
    }
  }

  // Get total pages for pagination
  totalPages() {
    return Math.ceil(this.filteredPatients.length / this.itemsPerPage);
  }
}