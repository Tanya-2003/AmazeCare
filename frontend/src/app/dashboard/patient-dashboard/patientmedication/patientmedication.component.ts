import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-patientmedication',
  templateUrl: './patientmedication.component.html',
  styleUrls: ['./patientmedication.component.scss'],
})
export class PatientmedicationComponent implements OnInit {
  medicines: any[] = [];
  patientId!: number; // Initialize patientId as undefined

  constructor(private medicationService: AuthService) {}

  ngOnInit(): void {
    this.getUserIdFromLocalStorage();
    this.fetchMedications();
  }

  // Fetch the userId from localStorage
  getUserIdFromLocalStorage(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.patientId = Number(storedUserId);
    } else {
      console.error('User ID not found in local storage');
      // Handle missing user ID appropriately (e.g., redirect to login)
    }
  }

  // fetchMedications(): void {
  //   if (this.patientId) {
  //     this.medicationService.getMedications(this.patientId).subscribe(
  //       (records) => {
  //         // Map the API response to the desired format
  //         this.medicines = records.flatMap((record: any) => {
  //           const medicineNames = record.medicineName.split(',');
  //           const frequencies = record.medicineFrequency.split(',');
  //           const timings = record.medicineTime.split(',');
  
  //           // Use the length of the longest array to ensure we cover all medicines
  //           const maxLength = Math.max(medicineNames.length, frequencies.length, timings.length);
  
  //           return Array.from({ length: maxLength }, (_, index) => ({
  //             medicineName: medicineNames[index]?.trim() || '', // Handle undefined by providing an empty string
  //             dosage: frequencies[index]?.trim() || '',
  //             timing: timings[index]?.trim() || '',
  //           }));
  //         });
  //       },
  //       (error) => {
  //         console.error('Error fetching medications', error);
  //       }
  //     );
  //   }
  // }
  fetchMedications(): void {
    if (this.patientId) {
      this.medicationService.getMedications(this.patientId).subscribe(
        (records) => {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Date one week ago

          // Map the API response to the desired format
          this.medicines = records.flatMap((record: any) => {
            const medicineNames = record.medicineName.split(',');
            const frequencies = record.medicineFrequency.split(',');
            const timings = record.medicineTime.split(',');

            // Check if the appointment date is within the last week
            const appointmentDate = new Date(record.appointmentDate); // Assuming appointmentDate is part of the record
            if (appointmentDate < oneWeekAgo) {
              // If appointment ended more than a week ago, remove the medicine names
              return Array.from({ length: Math.max(frequencies.length, timings.length) }, (_, index) => ({
                medicineName: '', // Set to empty if appointment ended more than a week ago
                dosage: frequencies[index]?.trim() || '',
                timing: timings[index]?.trim() || '',
              }));
            }

            // Use the length of the longest array to ensure we cover all medicines
            const maxLength = Math.max(medicineNames.length, frequencies.length, timings.length);

            return Array.from({ length: maxLength }, (_, index) => ({
              medicineName: medicineNames[index]?.trim() || '',
              dosage: frequencies[index]?.trim() || '',
              timing: timings[index]?.trim() || '',
            }));
          });
        },
        (error) => {
          console.error('Error fetching medications', error);
        }
      );
    }
  }
  
}
