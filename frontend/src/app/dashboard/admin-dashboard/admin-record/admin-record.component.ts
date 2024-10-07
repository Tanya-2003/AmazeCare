import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { MedicalRecord } from '../../../models/medicalRecord.model';
import { DoctorRegisterDTO } from '../../../models/DoctorRegisterDTO.model';
import { Patient } from '../../../models/patient.model';
import { forkJoin, map } from 'rxjs';


@Component({
  selector: 'app-admin-record',
  templateUrl: './admin-record.component.html',
  styleUrls: ['./admin-record.component.scss']
})
export class AdminRecordComponent implements OnInit {
  isAddMode: boolean = false; 
  isEditMode: boolean = false; 
  newRecord: MedicalRecord = { 
    patientId: 0,
    doctorId: 0,
    appointmentId: 0,
    diagnosis: '',
    medicineName: '',
    medicineFrequency: '',
    medicineTime: '',
    treatmentPlan: '',
    nextAppointmentDate: '',
    insuranceCoverage: ''
  };
  // medicalRecords: MedicalRecord[] = []; 
  filteredRecords: MedicalRecord[] = []; 
  successMessage: string | null = null; 
  errorMessage: string | null = null; 
  selectedIndex: number | null = null; 
  isModalOpen: boolean = false;
  patients: any;
  filteredPatients!: any[];
  currentPage = 1;
  itemsPerPage = 5;
  searchQuery = '';
  sortField = '';
  // sortDirection = 1;
  sortDirection: 'asc' | 'desc' = 'asc'; // Add a property to track sort direction
  isEditing = false;
  showDeleteConfirm: boolean = false;
  showForm: boolean | undefined;
  selectedRecord: MedicalRecord | null = null; // To hold the selected record for editing
  currentRecordId: number | null = null; // To store the ID of the record to delete
  medicalRecords: (MedicalRecord & { doctorName?: string, patientName?: string })[] = [];
  loading!: boolean;
  records!: {
    patientName: string; // Get patient name or 'Unknown'
    doctorName: string; // Get doctor name or 'Unknown'
    appointmentDate: string; // Ensure appointmentDate is not undefined
    recordId?: number; patientId: number; doctorId: number; appointmentId: number; diagnosis: string; medicineName: string; medicineFrequency: string; medicineTime: string; treatmentPlan: string; nextAppointmentDate: string; insuranceCoverage: string;
  }[];
  doctorNames: any;
  patientNames: any;


  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchRecords();
    // this.fetchMedicalRecords();
    // this.loadMedicalRecords(); // Load medical records on init
  }

  // fetchMedicalRecords(): void {
  //   this.adminService.getMedicalRecords().subscribe(
  //     (records: MedicalRecord[]) => {
  //       this.medicalRecords = records;
  //       this.filteredRecords = [...this.medicalRecords]; // Initialize filtered records
  //       this.currentPage = 1; // Reset to the first page after fetching records
  //     },
  //     (error) => {
  //       console.error('Error fetching medical records', error);
  //     }
  //   );
  // }

  //with names works but slow
  // fetchMedicalRecords(): void {
  //   this.adminService.getMedicalRecords().subscribe(
  //     (records: MedicalRecord[]) => {
  //       const requests = records.map(record => {
  //         const doctor$ = this.adminService.getDoctorById(record.doctorId);
  //         const patient$ = this.adminService.getPatientById(record.patientId);
          
  //         return forkJoin([doctor$, patient$]).pipe(
  //           map(([doctor, patient]) => ({
  //             ...record,
  //             doctorName: doctor ? `${doctor.firstName} ${doctor.lastName}` : 'N/A',
  //             patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'N/A'
  //           }))
  //         );
  //       });

  //       // Execute all requests and update medicalRecords
  //       // forkJoin(requests).subscribe(
  //       //   (fullRecords) => {
  //       //     this.medicalRecords = fullRecords; // Set the combined records with names
  //       //   },
  //       //   (error) => {
  //       //     console.error('Error fetching doctor or patient data', error);
  //       //   }
  //       forkJoin(requests).subscribe(
  //         (fullRecords) => {
  //           this.medicalRecords = fullRecords; // Set the combined records with names
  //           this.cdr.detectChanges(); // Manually trigger change detection
  //         },
  //         (error) => {
  //           console.error('Error fetching doctor or patient data', error);
  //         }
  //       );
  //     },
  //     (error) => {
  //       console.error('Error fetching medical records', error);
  //     }
  //   );
  // }

  fetchRecords(): void {
    this.loading = true; // Set loading state to true
    this.adminService.getMedicalRecords().subscribe(
      (records: MedicalRecord[]) => {
        console.log('Fetched Records:', records); // Log fetched records

        // Format the nextAppointmentDate to 'YYYY-MM-DD'
        records.forEach(record => {
          if (record.nextAppointmentDate) {
            record.nextAppointmentDate = record.nextAppointmentDate.split('T')[0]; // Extract the date part
          }
        });

        // Fetch unique doctor and patient IDs
        const doctorIds = [...new Set(records.map(record => record.doctorId).filter(id => id !== undefined))] as number[];
        const patientIds = [...new Set(records.map(record => record.patientId).filter(id => id !== undefined))] as number[];

        // Fetch doctors and patients in parallel using forkJoin
        forkJoin([
          this.adminService.getDoctorsByIds(doctorIds),
          this.adminService.getPatientsByIds(patientIds)
        ]).subscribe(([doctors, patients]) => {
          const doctorMap = new Map<number, string>(
            doctors.map((doctor: DoctorRegisterDTO) => [
              doctor.doctorId as number, // Ensure that doctorId is a number
              `${doctor.firstName} ${doctor.lastName}`
            ])
          );
          const patientMap = new Map<number, string>(
            patients.map((patient: Patient) => [
              patient.patientId as number, // Ensure that patientId is a number
              `${patient.firstName} ${patient.lastName}`
            ])
          );

          this.records = records.map(record => ({
            ...record,
            patientName: patientMap.get(record.patientId) || 'Unknown', // Get patient name or 'Unknown'
            doctorName: doctorMap.get(record.doctorId) || 'Unknown', // Get doctor name or 'Unknown'
            appointmentDate: record.appointmentDate || '' // Ensure appointmentDate is not undefined
          }));

          this.filteredRecords = [...this.records]; // Initialize filtered records
          this.loading = false; // Stop loading after fetching
        }, (error) => {
          console.error('Error fetching doctor/patient names:', error); // Log any fetching error
          this.loading = false; // Stop loading on error
        });
      },
      (error) => {
        console.error('Error fetching medical records:', error); // Log any error fetching records
        this.loading = false; // Stop loading on error
      }
    );
}

  // Fetch doctor names and store them in a lookup object
  fetchDoctorNames(): void {
    this.adminService.getDoctors().subscribe(
      (doctors: DoctorRegisterDTO[]) => {
        doctors.forEach(doctor => {
          if (doctor.doctorId !== undefined) {
            this.doctorNames[doctor.doctorId] = `${doctor.firstName} ${doctor.lastName}`;
          }
        });
        this.mapNamesToRecords();
      },
      (error) => console.error('Error fetching doctors:', error)
    );
  }

  // Fetch patient names and store them in a lookup object
  fetchPatientNames(): void {
    this.adminService.getPatients().subscribe(
      (patients: Patient[]) => {
        patients.forEach(patient => {
          if (patient.patientId !== undefined) {
            this.patientNames[patient.patientId] = `${patient.firstName} ${patient.lastName}`;
          }
        });
        this.mapNamesToRecords();
      },
      (error) => console.error('Error fetching patients:', error)
    );
  }

  // Map doctor and patient names to the corresponding records
  mapNamesToRecords(): void {
    this.records.forEach(record => {
      record.doctorName = this.doctorNames[record.doctorId || 0] || 'Unknown Doctor';
      record.patientName = this.patientNames[record.patientId || 0] || 'Unknown Patient';
    });
    this.filteredRecords = [...this.records];
  }
  
  getPaginatedRecords(): MedicalRecord[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredRecords.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  totalPages(): number {
    return Math.ceil(this.filteredRecords.length / this.itemsPerPage);
  }

  // // Search functionality
  // searchRecords(): void {
  //   this.filterAndSortRecords(); // Re-filter and sort when searching
  // }

  // // Sort by a field (e.g., diagnosis, doctorId, etc.)
  // sortRecords(field: string): void {
  //   if (this.sortField === field) {
  //     this.sortDirection = -this.sortDirection; // Toggle sort direction for the same field
  //   } else {
  //     this.sortField = field;
  //     this.sortDirection = 1; // Reset to ascending when switching fields
  //   }
  //   this.filterAndSortRecords(); // Call to re-filter and sort after setting sort field
  // }

  // // Combine filtering and sorting
  // filterAndSortRecords(): void {
  //   let filtered = [...this.medicalRecords];

  //   // Filtering by search query
  //   if (this.searchQuery) {
  //     const query = this.searchQuery.toLowerCase();
  //     filtered = filtered.filter(record =>
  //       record.diagnosis.toLowerCase().includes(query) ||
  //       record.medicineName.toLowerCase().includes(query // Add other fields as necessary
  //     ));
  //   }

  //   // Sorting based on the selected field and direction
  //   if (this.sortField) {
  //     filtered.sort((a, b) => {
  //       const aValue = (a as any)[this.sortField]?.toLowerCase() || '';
  //       const bValue = (b as any)[this.sortField]?.toLowerCase() || '';

  //       if (aValue > bValue) return this.sortDirection;
  //       if (aValue < bValue) return -this.sortDirection;
  //       return 0;
  //     });
  //   }

  //   this.filteredRecords = filtered; // Update the filtered records
  //   this.currentPage = 1; // Reset to the first page after filtering/sorting
  // }
  
  // Search functionality
  searchRecords(): void {
    this.filterRecords();
  }

  // Filter records based on search query
  filterRecords(): void {
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      this.filteredRecords = this.records.filter(record =>
        record.patientName?.toLowerCase().includes(query) ||
        record.doctorName?.toLowerCase().includes(query)
      );
    } else {
      this.filteredRecords = [...this.records];
    }
    this.currentPage = 1;
  }

  // sortRecords(property: 'patientName' | 'doctorName'): void {
  //   this.filteredRecords.sort((a, b) => {
  //     const nameA = a[property]?.toLowerCase() || '';
  //     const nameB = b[property]?.toLowerCase() || '';
  //     return nameA.localeCompare(nameB);
  //   });
  //   this.currentPage = 1; // Reset to first page after sorting
  // }

  sortRecords(property: 'patientName' | 'doctorName'): void {
    // Toggle sort direction
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.filteredRecords.sort((a, b) => {
        const nameA = a[property]?.toLowerCase() || '';
        const nameB = b[property]?.toLowerCase() || '';

        if (this.sortDirection === 'asc') {
            return nameA.localeCompare(nameB); // Ascending order
        } else {
            return nameB.localeCompare(nameA); // Descending order
        }
    });

    this.currentPage = 1; // Reset to first page after sorting
  }

  // loadMedicalRecords(): void {
  //   this.adminService.getMedicalRecords().subscribe(
  //     (records: MedicalRecord[]) => {
  //       this.medicalRecords = records;
  //       this.filteredRecords = [...this.medicalRecords]; // Initialize filtered records
  //     },
  //     (error) => {
  //       console.error('Error fetching medical records', error);
  //       this.errorMessage = 'Failed to load medical records.';
  //     }
  //   );
  // }
  
  saveRecord(form: any): void {
    if (form.valid) {
        // if (this.isAddMode) {
        //     this.adminService.addRecord(this.newRecord).subscribe(
        //         (response) => {
        //             this.medicalRecords.push(response); 
        //             this.filteredRecords = [...this.medicalRecords]; 
        //             this.successMessage = 'Medical record added successfully!';
        //             this.errorMessage = null;
        //             this.closeForm(); 
        //             this.autoClearMessage(); 
        //         },
        //         (error) => {
        //             console.error('Error adding medical record', error);
        //             this.successMessage = null;
        //             this.errorMessage = 'Failed to add medical record.';
        //             this.autoClearMessage(); 
        //         }
        //     );
        if (this.isAddMode) {
          this.adminService.addRecord(this.newRecord).subscribe(
              (response) => {
                  // Instead of pushing, you might want to fetch all records again or add the response directly
                  this.fetchRecords(); // Fetch all records after addition
                  this.successMessage = 'Medical record added successfully!';
                  this.errorMessage = null;
                  this.closeForm(); 
                  this.autoClearMessage(); 
              },
              (error) => {
                  console.error('Error adding medical record', error);
                  this.successMessage = null;
                  this.errorMessage = 'Failed to add medical record.';
                  this.autoClearMessage(); 
              }
          );
        } else if (this.isEditMode && this.newRecord.recordId !== undefined) { // Check if recordId is defined
            //prefer this if reverting
            // this.adminService.updateRecord(this.newRecord.recordId, this.newRecord).subscribe(
            //   () => {
            //     const index = this.medicalRecords.findIndex(r => r.recordId === this.newRecord.recordId);
            //     if (index !== -1) {
            //       this.medicalRecords[index] = { ...this.newRecord }; // Update the local array
            //       this.filteredRecords = [...this.medicalRecords]; // Refresh filtered records
            //       this.successMessage = 'Medical record updated successfully!';
            //       this.errorMessage = null;
            //       this.closeForm(); 
            //       this.autoClearMessage(); 
            //     }
            //   },
            //     (error) => {
            //         console.error('Error updating medical record', error);
            //         this.successMessage = null;
            //         this.errorMessage = 'Failed to update medical record.';
            //         this.autoClearMessage(); 
            //     }
            // );
            this.adminService.updateRecord(this.newRecord.recordId, this.newRecord).subscribe(
              () => {
                  this.fetchRecords(); // Refresh the records after updating
                  this.successMessage = 'Medical record updated successfully!';
                  this.errorMessage = null;
                  this.isEditMode = false; // Exit edit mode
                  this.closeForm(); // Close the form after successful update
                  this.autoClearMessage(); 
              },
              (error) => {
                  console.error('Error updating medical record', error);
                  this.successMessage = null;
                  this.errorMessage = 'Failed to update medical record.';
                  this.autoClearMessage(); 
              }
          );
        }
    }
  }

  closeForm(): void {
    this.isAddMode = false;
    this.isEditMode = false;
    this.newRecord = { // Reset the newRecord to its initial state
        patientId: 0,
        doctorId: 0,
        appointmentId: 0,
        diagnosis: '',
        medicineName: '',
        medicineFrequency: '',
        medicineTime: '',
        treatmentPlan: '',
        nextAppointmentDate: '',
        insuranceCoverage: ''
    } as MedicalRecord; // Use type assertion here
    this.selectedIndex = null;
  }

  autoClearMessage(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000); // Clear messages after 3 seconds
  }

  // cancelEdit(): void {
  //   // Reset the form state
  //   this.isEditMode = false; // Exit edit mode
  //   this.newRecord = { // Clear the new record form
  //       patientId: 0,
  //       doctorId: 0,
  //       appointmentId: 0,
  //       diagnosis: '',
  //       medicineName: '',
  //       medicineFrequency: '',
  //       medicineTime: '',
  //       treatmentPlan: '',
  //       nextAppointmentDate: '',
  //       insuranceCoverage: ''
  //   };
  //   this.successMessage = null; // Clear success message
  //   this.errorMessage = null; // Clear error message
  //   this.selectedIndex = null; // Clear selected index
  //   this.filteredRecords = [...this.medicalRecords]; // Refresh the filtered records list
  //   this.closeForm(); // Close the form/modal if applicable
  // }

  cancelEdit(): void {
    // Reset the form state
    this.isEditMode = false; // Exit edit mode

    // Clear the new record form
    this.newRecord = { 
        patientId: 0, // Set to null for better type safety
        doctorId: 0,  // Set to null for better type safety
        appointmentId: 0, // Set to null for better type safety
        diagnosis: '',
        medicineName: '',
        medicineFrequency: '',
        medicineTime: '',
        treatmentPlan: '',
        nextAppointmentDate: '',
        insuranceCoverage: ''
    };

    this.successMessage = null; // Clear success message
    this.errorMessage = null; // Clear error message
    this.selectedIndex = null; // Clear selected index

    // Re-fetch records to ensure the list is current
    this.fetchRecords(); // Refresh the records list with updated data

    // Optionally, close the form/modal if applicable
    this.closeForm(); 
  }

  // cancelDelete(): void {
  //   this.selectedIndex = null; // Clear selected index (if needed)
  //   this.successMessage = null; // Clear success message
  //   this.errorMessage = null; // Clear error message
  //   this.closeModal(); // Close the delete confirmation modal
  //   this.filteredRecords = [...this.medicalRecords]; // Refresh the filtered records list
  // }

  cancelDelete(): void {
    // Clear selected index if necessary
    this.selectedIndex = null; 
    
    // Clear any messages
    this.successMessage = null; // Clear success message
    this.errorMessage = null; // Clear error message
    
    // Close the delete confirmation modal
    this.closeModal(); 

    // Re-fetch records to ensure the list is current
    this.fetchRecords(); // Refresh the records list with updated data
  }

  closeModal(): void {
    this.isModalOpen = false; // Assuming you have a flag to track modal visibility
    this.selectedIndex = null; // Clear selected index if needed
    this.successMessage = null; // Clear success message
    this.errorMessage = null; // Clear error message
    this.showDeleteConfirm = false; // Assuming this controls the modal visibility
    this.newRecord = { // Reset the record form if applicable
        patientId: 0,
        doctorId: 0,
        appointmentId: 0,
        diagnosis: '',
        medicineName: '',
        medicineFrequency: '',
        medicineTime: '',
        treatmentPlan: '',
        nextAppointmentDate: '',
        insuranceCoverage: ''
    };
  }

  deleteRecord(recordId: number): void {
    if (recordId) {
        this.adminService.deleteRecord(recordId).subscribe(
            () => {
                // Filter out the deleted record from the patients array
                // this.patients = this.patients.filter((record: { recordId: number; }) => record.recordId !== recordId);
                // this.filteredPatients = [...this.patients]; // Refresh filtered list
                // this.successMessage = 'Record deleted successfully!';
                // this.errorMessage = null;
                
                 // Show success message for deletion
                 this.successMessage = 'Record deleted successfully!';
                 this.errorMessage = null;
 
                 // Refresh the records after deletion
                 this.fetchRecords(); // Call to fetchRecords instead of fetchPatients
 
                this.closeModal(); // Close the modal after deletion
                this.autoClearMessage(); // Automatically clear messages
            },
            (error) => {
                console.error('Error deleting record', error);
                this.successMessage = null;
                this.errorMessage = 'Failed to delete record.';
                this.autoClearMessage(); // Automatically clear messages
            }
        );
    } else {
        console.error('No record ID provided for deletion');
        this.successMessage = null;
        this.errorMessage = 'Invalid record ID.';
        this.autoClearMessage(); // Automatically clear messages
    }
  }

  // Method to fetch patients
// fetchPatients(): void {
//   this.adminService.getPatients().subscribe(
//       (patients: Patient[]) => {
//           this.patients = patients; // Update the local patients array
//           this.filteredPatients = [...this.patients]; // Refresh filtered list
//       },
//       (error) => {
//           console.error('Error fetching patients', error);
//       }
//   );
// }

  openAddRecordModal(): void {
    this.isAddMode = true; // Set the mode to add
    this.isEditMode = false; // Ensure editing mode is off
    this.newRecord = {
        patientId: 0,
        doctorId: 0,
        appointmentId: 0,
        diagnosis: '',
        medicineName: '',
        medicineFrequency: '',
        medicineTime: '',
        treatmentPlan: '',
        nextAppointmentDate: '',
        insuranceCoverage: ''
    } as MedicalRecord; // Use type assertion here
    this.showForm = true; // Show the form for adding a new record
  }

  editRecord(record: MedicalRecord): void {
    this.isEditMode = true;
    this.isAddMode = false;

    // Set the selected record to the one being edited
    this.selectedRecord = record;

    // Populate the newRecord object with the selected record's details
    this.newRecord = { ...record }; // Spread to avoid reference issues
    this.showForm = true; // Show the form for editing
  }

  confirmDeleteRecord(recordId: number): void {
    this.showDeleteConfirm = true;  // Show the delete confirmation modal
    this.currentRecordId = recordId; // Store the record ID to be deleted
  }

  deleteConfirmedRecord(): void {
    if (this.currentRecordId !== null) {
      this.adminService.deleteRecord(this.currentRecordId).subscribe(
        () => {
          this.medicalRecords = this.medicalRecords.filter(record => record.recordId !== this.currentRecordId);
          this.filteredRecords = [...this.medicalRecords]; // Refresh filtered records
          this.successMessage = 'Record deleted successfully!';
          this.errorMessage = null;
          this.closeModal(); // Close the modal after deletion
          this.autoClearMessage(); // Automatically clear messages
        },
        (error) => {
          console.error('Error deleting record', error);
          this.successMessage = null;
          this.errorMessage = 'Failed to delete record.';
          this.autoClearMessage(); // Automatically clear messages
        }
      );
    }
  }

}



