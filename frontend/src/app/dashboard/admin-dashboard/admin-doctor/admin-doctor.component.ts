import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { DoctorRegisterDTO } from '../../../models/DoctorRegisterDTO.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin-doctor',
  templateUrl: './admin-doctor.component.html',
  styleUrls: ['./admin-doctor.component.scss']
})
export class AdminDoctorComponent {
  doctors: DoctorRegisterDTO[] = []; 
  filteredDoctors: DoctorRegisterDTO[] = [];
  searchQuery = '';
  sortField = '';
  sortDirection = 1;
  currentPage = 1;
  itemsPerPage = 5;

  newDoctor: any = {};
  isEditing = false;
  selectedIndex: number | null = null;
  isModalOpen = false;
  showDeleteConfirm = false;
  doctorToDelete: number | null = null;
  selectedDoctorName: string | null = null; 
 
  isAddMode = false;
  isEditMode = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private adminService: AdminService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchDoctors(); 
  }

  fetchDoctors(): void {
    this.adminService.getDoctors().subscribe(
      (doctors: DoctorRegisterDTO[]) => {
        this.doctors = doctors;
        this.filteredDoctors = [...this.doctors]; // Initialize filtered doctors
      },
      (error) => {
        console.error('Error fetching doctors', error);
        this.errorMessage = 'Error fetching doctors'; // Set error message
      }
    );
  }

  // Open modal for adding a new doctor
  openAddDoctorModal() {
    this.newDoctor = {};
    this.isEditing = false;
    this.isAddMode = true; // Set to add mode
    this.isModalOpen = true;
  }

   // Open modal for editing an existing doctor by name
   editDoctorData(doctorName: string) {
    this.selectedDoctorName = doctorName;
    const doctor = this.doctors.find(d => `${d.firstName} ${d.lastName}` === doctorName);

    if (doctor) {
        this.newDoctor = {
            ...doctor,
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            // Ensure doctorId is included
            doctorId: doctor.doctorId // Assuming this is the correct property for the ID
        };
        
        this.isEditing = true;
        this.isEditMode = true; // Set to edit mode
        this.isModalOpen = true;
    }
  }

  // saveDoctor(form: any): void {
  //   if (form.valid) {
  //     if (this.isAddMode) {
  //       // Logic for adding a new doctor
  //       this.adminService.addDoctor(this.newDoctor).subscribe(
  //         (newDoctor: DoctorRegisterDTO) => {
  //           this.doctors.push(newDoctor);
  //           this.filteredDoctors = [...this.doctors];
  //           this.successMessage = "Doctor details Added Successfully";
  //           this.errorMessage = "Details could not be added";
  //           this.isAddMode = false; 
  //           this.closeModal(); 
  //           this.autoClearMessage();
  //         },
  //         (error) => {
  //           console.error('Error adding doctor', error);
  //           this.successMessage = null; 
  //           this.errorMessage = 'Failed to add doctor.'; 
  //           this.autoClearMessage();
  //         }
  //       );
  //     } else if (this.isEditMode) {
  //       const doctorId = this.newDoctor.doctorId; // Ensure this holds the correct ID

  //       if (doctorId) {
  //         console.log('Updating doctor with ID:', doctorId);
  //         console.log('New Doctor Data:', this.newDoctor);

  //         // Ensure the correct doctor ID and format are being sent
  //         this.adminService.updateDoctor(doctorId, this.newDoctor).subscribe(
  //           () => {
  //             // Update the local array with the updated doctor
  //             const index = this.doctors.findIndex(d => d.doctorId === doctorId);
  //             if (index > -1) {
  //               this.doctors[index] = { ...this.newDoctor };
  //               this.filteredDoctors = [...this.doctors];
  //             }

  //             this.successMessage = "Doctor details Updated Successfully";
  //       this.errorMessage = "Details could not be updated";
  //             this.isEditMode = false; 
  //             this.closeModal(); 
  //             this.autoClearMessage();
  //           },
  //           (error) => {
  //             console.error('Error updating doctor', error);
  //             this.successMessage = null; 
  //             this.errorMessage = 'Failed to update doctor.'; 
  //             this.autoClearMessage();
  //           }
  //         );
  //       } else {
  //         console.error('Doctor ID is missing or invalid');
  //       }
  //     }
  //   }
  // }

  // autoClearMessage(): void {
  //     setTimeout(() => {
  //       this.successMessage = null;
  //       this.errorMessage = null;
  //     }, 3000); // Clear messages after 1.5 seconds
  // } 



  // Close the modal
  
  saveDoctor(form: any): void {
    if (form.valid) {
      if (this.isAddMode) {
        // Logic for adding a new doctor
        this.adminService.addDoctor(this.newDoctor).subscribe(
          (newDoctor: DoctorRegisterDTO) => {
            this.doctors.push(newDoctor);
            this.filteredDoctors = [...this.doctors];
            
            // Set success message and clear error message
            this.successMessage = "Doctor details added successfully!";
            this.errorMessage = null;  // Clear error message if any
            
            this.isAddMode = false;
            this.closeModal();
            this.cdr.detectChanges(); // Trigger change detection
            this.autoClearMessage();
          },
          (error) => {
            console.error('Error adding doctor', error);
            
            // Set error message and clear success message
            this.successMessage = null;  // Clear success message if any
            this.errorMessage = 'Failed to add doctor.';
            this.cdr.detectChanges(); // Trigger change detection

            this.autoClearMessage();
          }
        );
      } else if (this.isEditMode) {
        const doctorId = this.newDoctor.doctorId;
  
        if (doctorId) {
          console.log('Updating doctor with ID:', doctorId);
  
          this.adminService.updateDoctor(doctorId, this.newDoctor).subscribe(
            () => {
              // Update the local array with the updated doctor
              const index = this.doctors.findIndex((d) => d.doctorId === doctorId);
              if (index > -1) {
                this.doctors[index] = { ...this.newDoctor };
                this.filteredDoctors = [...this.doctors];
              }
  
              // Set success message and clear error message
              this.successMessage = "Doctor details updated successfully!";
              this.errorMessage = null;
  
              this.isEditMode = false;
              this.closeModal();
              this.cdr.detectChanges(); // Trigger change detection

              this.autoClearMessage();
            },
            (error) => {
              console.error('Error updating doctor', error);
  
              // Set error message and clear success message
              this.successMessage = null;
              this.errorMessage = 'Failed to update doctor.';
              this.cdr.detectChanges(); // Trigger change detection

              this.autoClearMessage();
            }
          );
        } else {
          console.error('Doctor ID is missing or invalid');
          this.successMessage = null;
          this.errorMessage = 'Doctor ID is missing or invalid.';
          this.cdr.detectChanges(); // Trigger change detection

          this.autoClearMessage();
        }
      }
    } else {
      console.warn('Form is not valid. Please check the input fields.');
      this.cdr.detectChanges(); // Trigger change detection

    }
  }
  
  // Update the `autoClearMessage` method
  autoClearMessage(): void {
    // Clear messages after a delay (e.g., 3 seconds instead of 1.5)
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000); // 3 seconds delay to give enough time for users to see the messages
  }
  
  closeModal() {
    this.isModalOpen = false;
    this.isEditing = false; // Reset editing state
    this.selectedIndex = null; // Reset selected index
    this.newDoctor = {}; // Clear the newDoctor object
    this.successMessage = null; // Reset success message on close
    this.errorMessage = null; // Reset error message on close
  }

  cancelEdit(): void {
    this.isAddMode = false;
    this.isEditMode = false;
  }

  // Save the new or edited doctor data
  addOrUpdateDoctor() {
    const doctor: DoctorRegisterDTO = {
      firstName: this.newDoctor.firstName,
      lastName: this.newDoctor.lastName,
      dateOfBirth: this.newDoctor.dateOfBirth,
      gender: this.newDoctor.gender,
      phoneNumber: this.newDoctor.phoneNumber,
      email: this.newDoctor.email,
      specialisation: this.newDoctor.specialisation,
      licenseNumber: this.newDoctor.licenseNumber,
      yearsOfExperience: this.newDoctor.yearsOfExperience,
      username: this.newDoctor.username,
      password: this.newDoctor.password
    };

    if (this.isEditing) {
      // Update existing doctor data
      this.doctors[this.selectedIndex!] = doctor;
      this.successMessage = 'Doctor updated successfully!'; // Set success message
    } else {
      // Add new doctor
      this.doctors.push(doctor);
      this.successMessage = 'Doctor added successfully!'; // Set success message
    }

    this.filterDoctors(); // Reapply search and sort after adding/updating
    this.closeModal();
  }

  // Open delete confirmation modal
  confirmDeleteDoctor(doctorId: number) {
    this.showDeleteConfirm = true;
    this.doctorToDelete = doctorId; // Store the doctorId for deletion
}

  // Delete a doctor after confirmation
  deleteDoctor() {
    if (this.doctorToDelete !== null) { // Ensure a doctor ID is selected
      const doctorId = this.doctorToDelete; // Now it holds the doctorId directly

      // Call the delete service method using the ID
      this.adminService.deleteDoctor(doctorId).subscribe(
        () => {
          // Remove the doctor from the local array based on ID
          this.doctors = this.doctors.filter(doctor => doctor.doctorId !== doctorId);
          this.filterDoctors(); // Reapply search and sort after deletion
          this.successMessage = `Doctor deleted successfully!`; // Set success message

          // Close the delete confirmation box
          this.showDeleteConfirm = false;

          // Automatically clear messages
          this.autoClearMessage();
        },
        (error) => {
          console.error('Error deleting doctor', error);
          this.errorMessage = 'Failed to delete doctor.'; // Set error message if the deletion fails
        }
      );
    } else {
      console.error('doctorToDelete is null');
    }
  }

  // Cancel the deletion process
  cancelDelete() {
    this.showDeleteConfirm = false; // Close the confirmation box
    this.doctorToDelete = null; // Reset the doctorToDelete
  }

  // Search functionality
  searchDoctors() {
    this.filterDoctors();
  }

  // Sort by a field (either name or specialization)
  sortDoctors(field: string) {
    if (this.sortField === field) {
      this.sortDirection = -this.sortDirection; // Toggle sort direction for the same field
    } else {
      this.sortField = field;
      this.sortDirection = 1; // Reset to ascending when switching fields
    }
    this.filterDoctors();
  }

  //Filter options
  filterDoctors() {
    let filtered = [...this.doctors];
  
    // Filter by search query for both name and specialization
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(doctor =>
        doctor.firstName.toLowerCase().includes(query) || 
        doctor.lastName.toLowerCase().includes(query) ||
        doctor.specialisation.toLowerCase().includes(query) // Include specialization in the filter
      );
    }
  
    // Sort by the selected field
    if (this.sortField) {
      filtered.sort((a, b) => {
        let aValue: string;
        let bValue: string;
  
        // Handle sorting for the fullName case
        if (this.sortField === 'fullName') {
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
        } else {
          aValue = (a as any)[this.sortField];
          bValue = (b as any)[this.sortField];
        }
  
        // Handle undefined values
        if (aValue === undefined) return 1; // Treat undefined as "greater"
        if (bValue === undefined) return -1; // Treat undefined as "less"
  
        if (aValue > bValue) return this.sortDirection;
        if (aValue < bValue) return -this.sortDirection;
        return 0;
      });
    }
  
    this.filteredDoctors = filtered;
    this.currentPage = 1; // Reset to the first page after sorting/searching
  }
  // Get paginated data
  getPaginatedDoctors() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredDoctors.slice(startIndex, endIndex);
  }

  // Pagination controls
  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Get total pages for pagination
  totalPages() {
    return Math.ceil(this.filteredDoctors.length / this.itemsPerPage);
  }
}
