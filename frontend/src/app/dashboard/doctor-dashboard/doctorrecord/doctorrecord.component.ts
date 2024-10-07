import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicalRecord } from '../../../models/medicalRecord.model';

@Component({
  selector: 'app-doctorrecord',
  templateUrl: './doctorrecord.component.html',
  styleUrls: ['./doctorrecord.component.css'],
})
export class DoctorrecordComponent implements OnInit {
  medicalRecords: any[] = [];
  selectedRecord: any = null; // To store the record being edited
  apiUrl: string;
  successMessage: string | null = null; // To hold the success message
  currentPage: number = 1;
  recordsPerPage: number = 2; // Adjust this number based on your needs
  totalPages: number = 0;
  paginatedRecords: any[] = [];
  editingPrescription: boolean = false; // Flag to track if editing prescription
  editingDiagnosis: boolean = false; // Flag to track if editing diagnosis

  // Reactive Form
  prescriptionForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    const userId = localStorage.getItem('userId');
    this.apiUrl = `https://localhost:7260/api/MedicalRecords/doctor/${userId}`; // Set the API URL

    // Initialize the form
    this.prescriptionForm = this.fb.group({
      medicineName: ['', Validators.required],
      morning: [false], // Checkbox for morning
      afternoon: [false], // Checkbox for afternoon
      night: [false], // Checkbox for night
      medicineTime: ['', Validators.required] // Radio button for BF/AF
    });
  }

  ngOnInit(): void {
    this.fetchMedicalRecords();
  }

  loadRecords() {
    const startIndex = (this.currentPage - 1) * this.recordsPerPage;
    const endIndex = startIndex + this.recordsPerPage;
    this.paginatedRecords = this.medicalRecords.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.medicalRecords.length / this.recordsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadRecords(); 
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRecords(); 
    }
  }

  fetchMedicalRecords() {
    this.http.get<any[]>(this.apiUrl).subscribe((records) => {
      console.log("Fetched records:", records);
      const patientRequests = records.map(record =>
        this.http.get<any>(`https://localhost:7260/api/Patients/${record.patientId}`).pipe(
          map(patient => ({
            ...record,
            patientName: `${patient.firstName} ${patient.lastName}` // Add patient name to record
          }))
        )
      );

      forkJoin(patientRequests).subscribe(updatedRecords => {
        console.log("Updated records with patient names:", updatedRecords);
        this.medicalRecords = updatedRecords; // Update medicalRecords with patient names
        this.loadRecords(); // Load the records here to trigger pagination
      });
    });
  }

  onEditRecord(record: any) {
    this.selectedRecord = { ...record };
    this.editingPrescription = true;
    this.editingDiagnosis = false;
  }

  onEditDiagnosis(record: any) {
    this.selectedRecord = { ...record };
    this.editingDiagnosis = true;
    this.editingPrescription = false;
  }

  // Save the updated prescription record to the API
  saveRecord() {
    // Check if form is valid before proceeding
    if (this.prescriptionForm.invalid) {
      alert('Please fill all required fields');
      return;
    }
  
    // Get form values properly instead of accessing `selectedRecord` directly
    const newMedicineName = this.prescriptionForm.value.medicineName.trim();
    const newMedicineFrequency = this.getMedicineFrequency();
    const newMedicineTime = this.prescriptionForm.value.medicineTime;
  
    // Retrieve the current record to get the existing prescription details
    this.http.get<any>(`https://localhost:7260/api/MedicalRecords/${this.selectedRecord.recordId}`).subscribe(
      (currentRecord) => {
        // Define variables to hold the existing values in the current record
        let existingMedicineName = currentRecord.medicineName || '';
        let existingMedicineFrequency = currentRecord.medicineFrequency || '';
        let existingMedicineTime = currentRecord.medicineTime || '';
  
        // Prepare an object to store the final values to be sent
        let updatedRecord = { ...currentRecord };
  
        // Check if the record already has the same medicine, frequency, and time
        const isSameMedicine = existingMedicineName === newMedicineName;
        const isSameFrequency = existingMedicineFrequency === newMedicineFrequency;
        const isSameTime = existingMedicineTime === newMedicineTime;
  
        // If the medicine already exists but frequency or time are different, update those fields
        if (isSameMedicine && isSameFrequency && isSameTime) {
          alert("This medicine with the same frequency and time already exists.");
          return;
        } else if (isSameMedicine) {
          // If the medicine is the same, append the new frequency and time values to avoid overwriting
          updatedRecord.medicineFrequency = this.appendValue(existingMedicineFrequency, newMedicineFrequency);
          updatedRecord.medicineTime = this.appendValue(existingMedicineTime, newMedicineTime);
        } else {
          // If it's a new medicine, update all three fields with new values
          updatedRecord.medicineName = newMedicineName;
          updatedRecord.medicineFrequency = newMedicineFrequency;
          updatedRecord.medicineTime = newMedicineTime;
        }
  
        // Send the updated record to the server
        this.http.put(`https://localhost:7260/api/MedicalRecords/${this.selectedRecord.recordId}`, updatedRecord)
          .subscribe(
            () => {
              // Update the local record in the main array
              const index = this.medicalRecords.findIndex(record => record.recordId === this.selectedRecord.recordId);
              if (index !== -1) {
                this.medicalRecords[index] = { ...this.medicalRecords[index], ...updatedRecord };
              }
  
              this.cancelEdit();
              this.successMessage = "Prescription successfully updated!";
              setTimeout(() => {
                this.successMessage = null;
              }, 3000);
            },
            (error) => {
              console.error('Error updating prescription:', error);
              alert('Failed to update prescription. Please try again.');
            }
          );
      },
      (error) => {
        console.error('Error retrieving the current record:', error);
        alert('Failed to retrieve current prescription. Please try again.');
      }
    );
    console.log('Form Status:', this.prescriptionForm.status); // Outputs 'VALID' or 'INVALID'
    console.log('Form Errors:', this.prescriptionForm.errors); // Outputs validation errors if any
  }
  
  // Helper function to append new values while avoiding duplicates
  appendValue(existingValue: string, newValue: string): string {
    if (!existingValue) return newValue; // If no existing value, just return the new one
    if (existingValue.includes(newValue)) return existingValue; // Avoid duplicates
    return `${existingValue}, ${newValue}`; // Append new value with a separator
  }
  
  getMedicineFrequency(): string {
    const formValues = this.prescriptionForm.value;
  
    // Generate frequency string based on form values
    const frequency = [
      formValues.morning ? '1' : '0',
      formValues.afternoon ? '1' : '0',
      formValues.night ? '1' : '0'
    ];
    console.log(this.prescriptionForm.value);
    return frequency.join('-'); // Returns a string like "1-0-1" or "0-0-0"
  }
  
  // Update medical record using PATCH for diagnosis and treatment plan
//   updateRecordDetails() {
//     const updateData = {
//       recordId: this.selectedRecord.recordId,
//       diagnosis: this.selectedRecord.diagnosis,
//       treatmentPlan: this.selectedRecord.treatmentPlan,
//       nextAppointmentDate: this.selectedRecord.nextAppointmentDate
//     };

//     this.http.put(`https://localhost:7260/api/MedicalRecords/${this.selectedRecord.recordId}`, updateData)
//       .subscribe(() => {
//   // Update the main medicalRecords array with the modified details
//   const index = this.medicalRecords.findIndex(record => record.recordId === this.selectedRecord.recordId);
//   if (index !== -1) {
//     this.medicalRecords[index] = { ...this.medicalRecords[index], ...updateData };
//   }

//     this.cancelEdit();
//     this.successMessage = "Diagnosis and treatment plan successfully updated!";
//     setTimeout(() => {
//       this.successMessage = null;
//     }, 3000);
//   },
//   (error) => {
//     console.error('Error updating diagnosis:', error);
//     alert('Failed to update diagnosis. Please try again.');
//   });
// }

// updateRecordDetails() {
//   // Format the date to match the expected "yyyy-MM-dd" format
//   const formattedDate = new Date(this.selectedRecord.nextAppointmentDate).toISOString().split('T')[0];

//   const updateData = {
//     diagnosis: this.selectedRecord.diagnosis,
//     treatmentPlan: this.selectedRecord.treatmentPlan,
//     nextAppointmentDate: formattedDate, // Use the formatted date here
//   };

//   console.log(updateData); // Log the data being sent
//   // Capture the form fields
//   const diagnosis = this.selectedRecord.diagnosis;
//   const treatmentPlan = this.selectedRecord.treatmentPlan;
  
//   // Convert the nextAppointmentDate from string to Date, then format it to ISO string
//   const nextAppointmentDate = new Date(this.selectedRecord.nextAppointmentDate).toISOString();

//   // Prepare the update data object
//   // const updateData = {
//   //   diagnosis: this.selectedRecord.diagnosis,
//   //   treatmentPlan: this.selectedRecord.treatmentPlan,
//   //   nextAppointmentDate: new Date(this.selectedRecord.nextAppointmentDate).toISOString(),
//   // };

//   console.log(updateData); // Log the data being sent

//   // Make the PUT request to update only the necessary fields
//   this.http.put(`https://localhost:7260/api/MedicalRecords/${this.selectedRecord.recordId}`, updateData)
//     .subscribe(
//       () => {
//         // Update the main medicalRecords array locally to reflect the changes
//         const index = this.medicalRecords.findIndex(record => record.recordId === this.selectedRecord.recordId);
//         if (index !== -1) {
//           this.medicalRecords[index] = { ...this.medicalRecords[index], ...updateData };
//         }

//         // Show success message and reset form state
//         this.cancelEdit();
//         this.successMessage = "Diagnosis and treatment plan successfully updated!";
//         setTimeout(() => {
//           this.successMessage = null;
//         }, 3000);
//       },
//       (error) => {
//         console.error('Error updating diagnosis:', error);
//         alert('Failed to update diagnosis. Please try again.');
//       }
//     );
// }

updateRecordDetails() {
  // Validate nextAppointmentDate format
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(this.selectedRecord.nextAppointmentDate)) {
    alert('Please enter the date in the format yyyy-MM-dd');
    return;
  }

  const updateData: MedicalRecord = {
    recordId: this.selectedRecord.recordId,
    patientId: this.selectedRecord.patientId, // Include required fields
    doctorId: this.selectedRecord.doctorId,   // Include required fields
    appointmentId: this.selectedRecord.appointmentId, // Include required fields
    diagnosis: this.selectedRecord.diagnosis,
    medicineName: this.selectedRecord.medicineName || '', // Ensure all required fields are populated
    medicineFrequency: this.selectedRecord.medicineFrequency || '',
    medicineTime: this.selectedRecord.medicineTime || '',
    treatmentPlan: this.selectedRecord.treatmentPlan,
    nextAppointmentDate: this.selectedRecord.nextAppointmentDate,
    insuranceCoverage: this.selectedRecord.insuranceCoverage || '', // Include required fields
  };

  console.log(updateData); // Log the data being sent

  this.http.put(`https://localhost:7260/api/MedicalRecords/${this.selectedRecord.recordId}`, updateData)
    .subscribe(
      () => {
        const index = this.medicalRecords.findIndex(record => record.recordId === this.selectedRecord.recordId);
        if (index !== -1) {
          this.medicalRecords[index] = { ...this.medicalRecords[index], ...updateData };
        }
        this.cancelEdit();
        this.successMessage = "Diagnosis and treatment plan successfully updated!";
        setTimeout(() => { this.successMessage = null; }, 3000);
      },
      (error) => {
        console.error('Error updating diagnosis:', error);
        if (error.error && error.error.errors) {
          console.error('Validation Errors:', error.error.errors);
          alert('Validation errors occurred: ' + JSON.stringify(error.error.errors));
        } else {
          alert('Failed to update diagnosis. Please try again.');
        }
      }
    );
}
  // Get the selected time based on radio button selection
  getMedicineTime(): string {
    return this.selectedRecord.medicineTime; // Will return "BF" or "AF"
  }

  cancelEdit() {
    this.selectedRecord = null;
    this.editingPrescription = false;
    this.editingDiagnosis = false;
    this.prescriptionForm.reset(); 
  }
}
