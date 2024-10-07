import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { forkJoin } from 'rxjs';
import { DoctorRegisterDTO } from '../../../models/DoctorRegisterDTO.model';
import { Patient } from '../../../models/patient.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-appointment',
  templateUrl: './admin-appointment.component.html',
  styleUrls: ['./admin-appointment.component.scss']
})
export class AdminAppointmentComponent implements OnInit {
  appointments: any[] = []; // To store the fetched appointments
  filteredAppointments = [...this.appointments]; // For storing filtered/sorted data
  searchQuery = '';
  sortField = '';
  sortDirection = 1; // 1 for ascending, -1 for descending
  currentPage = 1;
  itemsPerPage = 4; // Items per page for pagination

  newAppointment: any = {}; // Holds appointment data for the form
  isEditing = false; // Flag for distinguishing between add and edit mode
  selectedIndex: number | null = null; // Index of the appointment being edited
  isModalOpen = false; // Controls modal visibility

  // Date filter variables
  selectedDate: string | null = null; // Holds the selected date for filtering
  selectedStatus: string = ''; // Holds the selected status for filtering

  // Lookup maps for doctor and patient names
  doctorNames: { [key: number]: string } = {};
  patientNames: { [key: number]: string } = {};

  // Flags to track the state of the form
  isAddMode: boolean = false;
  isEditMode: boolean = false; // Indicates if it's in Edit mode

  // Variables to handle success and error messages
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // For tracking the confirmation modal state
  showDeleteConfirm: boolean = false;

  // To store the ID of the currently selected appointment for deletion
  currentAppointmentId: number | null = null;
  appointmentForm!: FormGroup; // Define a FormGroup to handle the appointment form

  constructor(private adminService: AdminService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchAppointmentsWithNames();
    this.appointmentForm = this.fb.group({
      // Add the 'remarks' form control along with others in your form
      remarks: ['', Validators.required], // 'remarks' field with required validator
      // Add other form fields here if applicable
      patientId: [0, Validators.required],
      doctorId: [0, Validators.required],
      appointmentDate: ['', Validators.required],
      // ... additional fields
    });
  }

  // Fetch all appointments and map doctor/patient names
  // fetchAppointmentsWithNames() {
  //   this.adminService.getAppointments().subscribe(
  //     (data) => {
  //       this.appointments = data.map(appointment => ({
  //         ...appointment,
  //         appointmentDate: appointment.appointmentDate.split('T')[0], // Format date part
  //         appointmentTime: appointment.appointmentDate.split('T')[1]?.slice(0, 5) // Extract time
  //       }));

  //       // Fetch patient and doctor names
  //       const doctorIds = [...new Set(this.appointments.map(appointment => appointment.doctorId).filter(id => id !== undefined))] as number[];
  //       const patientIds = [...new Set(this.appointments.map(appointment => appointment.patientId).filter(id => id !== undefined))] as number[];

  //       forkJoin([
  //         this.adminService.getDoctorsByIds(doctorIds),
  //         this.adminService.getPatientsByIds(patientIds)
  //       ]).subscribe(
  //         ([doctors, patients]) => {
  //           const doctorMap = new Map<number, string>(
  //             doctors.map((doctor: DoctorRegisterDTO) => [
  //               doctor.doctorId as number, 
  //               `${doctor.firstName} ${doctor.lastName}`
  //             ])
  //           );

  //           const patientMap = new Map<number, string>(
  //             patients.map((patient: Patient) => [
  //               patient.patientId as number, 
  //               `${patient.firstName} ${patient.lastName}`
  //             ])
  //           );

  //           // Map names to appointments
  //           this.appointments = this.appointments.map(appointment => ({
  //             ...appointment,
  //             patientName: patientMap.get(appointment.patientId) || 'Unknown Patient',
  //             doctorName: doctorMap.get(appointment.doctorId) || 'Unknown Doctor'
  //           }));

  //           this.filteredAppointments = [...this.appointments];
  //         },
  //         (error) => {
  //           console.error('Error fetching doctor/patient names:', error);
  //         }
  //       );
  //     },
  //     (error) => {
  //       console.error('Error fetching appointments:', error);
  //     }
  //   );
  // }

  get remarks() {
    return this.appointmentForm.get('remarks'); // Define a getter for 'remarks' to access it in the template
  }

  fetchAppointmentsWithNames() {
    this.adminService.getAppointments().subscribe(
      (data) => {
        this.appointments = data.map(appointment => ({
          ...appointment,
          appointmentDate: appointment.appointmentDate.split('T')[0], // Format date part
          appointmentTime: appointment.appointmentDate.split('T')[1]?.slice(0, 5) // Extract time
        }));
  
        console.log('Fetched Appointments:', this.appointments); // <-- Log appointment data
  
        // Fetch patient and doctor names
        const doctorIds = [...new Set(this.appointments.map(appointment => appointment.doctorId).filter(id => id !== undefined))] as number[];
        const patientIds = [...new Set(this.appointments.map(appointment => appointment.patientId).filter(id => id !== undefined))] as number[];
  
        forkJoin([
          this.adminService.getDoctorsByIds(doctorIds),
          this.adminService.getPatientsByIds(patientIds)
        ]).subscribe(
          ([doctors, patients]) => {
            const doctorMap = new Map<number, string>(
              doctors.map((doctor: DoctorRegisterDTO) => [
                doctor.doctorId as number, 
                `${doctor.firstName} ${doctor.lastName}`
              ])
            );
  
            const patientMap = new Map<number, string>(
              patients.map((patient: Patient) => [
                patient.patientId as number, 
                `${patient.firstName} ${patient.lastName}`
              ])
            );
  
            // Map names to appointments
            this.appointments = this.appointments.map(appointment => ({
              ...appointment,
              patientName: patientMap.get(appointment.patientId) || 'Unknown Patient',
              doctorName: doctorMap.get(appointment.doctorId) || 'Unknown Doctor'
            }));
  
            this.filteredAppointments = [...this.appointments];
          },
          (error) => {
            console.error('Error fetching doctor/patient names:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }
  
  // Open modal for adding a new appointment
  openAddAppointmentModal(): void {
    this.isAddMode = true;
    this.isEditMode = false;  // Ensure edit mode is false
  }

  // Open modal for editing an existing appointment's status
  // editAppointmentStatus(index: number) {
  //   this.selectedIndex = index;
  //   this.newAppointment = { ...this.filteredAppointments[index] };
  //   this.isEditing = true;
  //   this.isModalOpen = true;
  // }

  // editAppointmentStatus(index: number): void {
  //   this.isEditMode = true;
  //   this.isAddMode = false;  // Ensure add mode is false
  //   // Load the selected appointment data for editing here
  // }


  // editAppointmentStatus(index: number): void {
  //   const appointment = this.getPaginatedAppointments()[index];
  //   this.currentAppointmentId = appointment.id; // Set the correct ID
  //   this.openDeleteModal(appointment.id); // Show the modal with the correct appointment ID
  // }

  editAppointmentStatus(appointmentId: number) {
    // Logic to set the appointment data to be edited
    this.newAppointment = this.appointments.find(appt => appt.appointmentId === appointmentId);
    this.isEditMode = true; // Set edit mode
    this.showDeleteConfirm = false; // Make sure delete modal is hidden
  }

  cancelEdit(): void {
    console.log("Cancel button clicked. Exiting add/edit mode.");
    this.isAddMode = false;
    this.isEditMode = false;
    console.log("isAddMode:", this.isAddMode, "isEditMode:", this.isEditMode);
  }

  // Close modal
  closeModal(): void {
    this.showDeleteConfirm = false; // Ensure this method sets the flag to false
  }

  // Save the new or edited appointment data
  addOrUpdateAppointment() {
    if (this.isEditing) {
      // Update existing appointment
      this.appointments[this.selectedIndex!] = this.newAppointment;
    } else {
      // Add new appointment
      this.appointments.push(this.newAppointment);
    }

    this.filterAppointments(); // Reapply search and sort after adding/updating
    this.closeModal();
  }

  // Search functionality
  searchAppointments() {
    this.filterAppointments();
  }

  // Sort by a field (either patient name or doctor name)
  sortAppointments(field: string) {
    if (this.sortField === field) {
      this.sortDirection = -this.sortDirection; // Toggle sort direction
    } else {
      this.sortField = field;
      this.sortDirection = 1; // Reset to ascending
    }
    this.filterAppointments();
  }

  // Search and Filter functionality
  filterAppointments() {
    let filtered = [...this.appointments];
  
    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(appointment => appointment.patientName.toLowerCase().includes(query));
    }
  
    // Filter by selected date
    if (this.selectedDate) {
      filtered = filtered.filter(appointment => appointment.appointmentDate === this.selectedDate);
    }
  
    // Filter by selected status
    if (this.selectedStatus) {
      filtered = filtered.filter(appointment => 
        appointment.status.toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }
  
    // Sort by the selected field
    if (this.sortField) {
      filtered.sort((a, b) => {
        const aValue = (a as any)[this.sortField];
        const bValue = (b as any)[this.sortField];
        if (aValue > bValue) return this.sortDirection;
        if (aValue < bValue) return -this.sortDirection;
        return 0;
      });
    }
  
    this.filteredAppointments = filtered;
    this.currentPage = 1; // Reset to the first page after sorting/searching
  }  

  // Get paginated data
  getPaginatedAppointments() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredAppointments.slice(startIndex, endIndex);
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
    return Math.ceil(this.filteredAppointments.length / this.itemsPerPage);
  }

  saveAppointment(form: any): void {
    if (form.valid) {
        if (this.isAddMode) {
            this.adminService.addAppointment(this.newAppointment).subscribe(
                (response) => {
                    this.fetchAppointmentsWithNames(); // Fetch all appointments after addition
                    this.successMessage = 'Appointment added successfully!';
                    this.errorMessage = null;
                    this.closeForm(); // Close the form after successful addition
                    this.autoClearMessage(); // Clear success or error messages automatically
                },
                (error) => {
                    console.error('Error adding appointment', error);
                    this.successMessage = null;
                    this.errorMessage = 'Failed to add appointment.';
                    this.autoClearMessage(); // Clear error message automatically
                }
            );
        } else if (this.isEditMode && this.newAppointment.appointmentId !== undefined) {
            this.adminService.updateAppointment(this.newAppointment.appointmentId, this.newAppointment).subscribe(
                () => {
                    this.fetchAppointmentsWithNames(); // Refresh the appointments list after update
                    this.successMessage = 'Appointment updated successfully!';
                    this.errorMessage = null;
                    this.isEditMode = false; // Exit edit mode
                    this.closeForm(); // Close the form after successful update
                    this.autoClearMessage(); // Auto-clear success/error messages
                },
                (error) => {
                    console.error('Error updating appointment', error);
                    this.successMessage = null;
                    this.errorMessage = 'Failed to update appointment.';
                    this.autoClearMessage(); // Clear error message automatically
                }
            );
        }
    }
  } 
  // Method to close the form (reset form and mode flags)
  // closeForm(): void {
  //   this.newAppointment = {}; // Reset the form object
  //   this.isAddMode = true; // Set back to Add mode
  //   this.isEditMode = false; // Disable Edit mode
  // }
  closeForm(): void {
    this.isAddMode = false;
    this.isEditMode = false;
    this.newAppointment = {}; // Reset the appointment object, if necessary
}

  // Method to clear success and error messages after a delay
  autoClearMessage(): void {
    setTimeout(() => {
        this.successMessage = null;
        this.errorMessage = null;
    }, 3000); // Clear messages after 3 seconds
  }

  // cancelEdit(): void {
  //   // Reset the form state
  //   this.isEditMode = false; // Exit edit mode
  //   this.isAddMode = false;
  //   // Clear the new appointment form
  //   this.newAppointment = { 
  //       patientId: 0, // Set patientId to a default value
  //       doctorId: 0,  // Set doctorId to a default value
  //       appointmentId: 0, // Set appointmentId to a default value
  //       appointmentDate: '', // Clear date string
  //       appointmentTime: '', // Clear time string
  //       reasonForVisit: '', // Clear reason for visit
  //       appointmentStatus: '', // Reset appointment status
  //       followUpRequired: false, // Reset follow-up requirement
  //   };

  //   this.successMessage = null; // Clear success message
  //   this.errorMessage = null; // Clear error message
  //   this.selectedIndex = null; // Clear selected index

  //   // Re-fetch appointments to ensure the list is current
  //   this.fetchAppointmentsWithNames(); // Refresh the appointments list with updated data

  //   // Close the form if applicable
  //   this.closeForm(); 
  // }

  confirmDeleteAppointment(appointmentId: number): void {
    this.showDeleteConfirm = true;  // Show the delete confirmation modal
    this.currentAppointmentId = appointmentId; // Store the appointment ID to be deleted
  }

  deleteConfirmedAppointment(): void {
      if (this.currentAppointmentId !== null) {
          this.adminService.deleteAppointment(this.currentAppointmentId).subscribe(
              () => {
                  // // Filter out the deleted appointment from the list
                  // this.appointments = this.appointments.filter(appointment => appointment.appointmentId !== this.currentAppointmentId);
                  // this.filteredAppointments = [...this.appointments]; // Refresh filtered appointments

                  // Show success message
                  this.successMessage = 'Appointment deleted successfully!';
                  this.errorMessage = null;
                  
                  // Close the modal and clear messages
                  this.closeModal(); 
                  this.autoClearMessage(); 
              },
              (error) => {
                  // Handle the error
                  console.error('Error deleting appointment', error);
                  this.successMessage = null;
                  this.errorMessage = 'Failed to delete appointment.';
                  this.autoClearMessage(); 
              }
          );
      }
  }

  deleteAppointment(appointmentId: number): void {
    if (appointmentId) {
      console.log("Deleting appointment with ID:", appointmentId);
      this.adminService.deleteAppointment(appointmentId).subscribe(
        () => {
          // Show success message for deletion
          this.successMessage = 'Appointment deleted successfully!';
          this.errorMessage = null;
  
          // Refresh the appointments after deletion
          this.fetchAppointmentsWithNames(); // Fetch the updated appointments list
  
          this.closeModal(); // Close the modal after deletion
          this.autoClearMessage(); // Automatically clear messages
        },
        (error) => {
          console.error('Error deleting appointment', error);
          this.successMessage = null;
          this.errorMessage = 'Failed to delete appointment.';
          this.autoClearMessage(); // Automatically clear messages
        }
      );
    } else {
      console.error('No appointment ID provided for deletion');
      this.successMessage = null;
      this.errorMessage = 'Invalid appointment ID.';
      this.autoClearMessage(); // Automatically clear messages
    }
  }
  
  // cancelDelete(): void {
  //   // Clear any selected index or ID if necessary
  //   this.currentAppointmentId = null; // Reset the appointment ID to null
  
  //   // Clear any messages
  //   this.successMessage = null; // Clear success message
  //   this.errorMessage = null; // Clear error message
  
  //   // Close the delete confirmation modal
  //   this.closeModal(); 
  
  //   // Re-fetch appointments to ensure the list is current
  //   this.fetchAppointmentsWithNames(); // Refresh the appointments list with updated data
  // }

  cancelDelete(): void {
    // Clear any selected index or ID if necessary
    this.currentAppointmentId = null; // Reset the appointment ID to null
  
    // Clear any messages
    this.successMessage = null; // Clear success message
    this.errorMessage = null; // Clear error message
  
    // Close the delete confirmation modal
    this.showDeleteConfirm = false; // Set the flag to false
  
    // Optionally call closeModal if there are additional clean-up operations
    this.closeModal();
  
    // Re-fetch appointments to ensure the list is current
    this.fetchAppointmentsWithNames(); // Refresh the appointments list with updated data
  }
  
  openDeleteModal(appointmentId: number): void {
    this.currentAppointmentId = appointmentId; // Set the ID of the appointment to be deleted
    this.showDeleteConfirm = true; // Show the delete confirmation modal
  }
  
}
