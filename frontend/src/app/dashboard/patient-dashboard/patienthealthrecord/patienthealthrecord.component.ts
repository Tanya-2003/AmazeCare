import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DoctorserviceService } from '../../../services/doctorservice.service';

@Component({
  selector: 'app-patienthealthrecord',
  templateUrl: './patienthealthrecord.component.html',
  styleUrls: ['./patienthealthrecord.component.scss'],
})
export class PatienthealthrecordComponent implements OnInit {
  medicalRecords: any[] = [];
  patientId!: number; // Initialize patientId as undefined or use optional chaining

  constructor(private medicalRecordService: AuthService, private doctorService: DoctorserviceService) {}

  ngOnInit(): void {
    this.getUserIdFromLocalStorage();
    this.fetchMedicalRecords();
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

  fetchMedicalRecords(): void {
    if (this.patientId) {
      this.medicalRecordService.getMedicalRecords(this.patientId).subscribe(
        // (records) => {
        //   this.medicalRecords = records;
        (records) => {
          this.medicalRecords = records;
          // Now fetch the doctor's name for each record
          this.medicalRecords.forEach(record => {
            this.fetchDoctorName(record);
          });
        },
        (error) => {
          console.error('Error fetching medical records', error);
        }
      );
    }
  }

  fetchDoctorName(record: any): void {
    this.doctorService.getDoctorById(record.doctorId).subscribe(
      (doctor) => {
        record.doctorName = `${doctor.firstName} ${doctor.lastName}`; // Ensure doctor object has firstName and lastName
      },
      (error) => {
        console.error(`Error fetching doctor name for ID ${record.doctorId}`, error);
      }
    );
  }

}
