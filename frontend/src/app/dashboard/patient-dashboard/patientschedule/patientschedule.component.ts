import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Appointment } from '../../../models/appointment.model';
import { DoctorserviceService } from '../../../services/doctorservice.service';

@Component({
  selector: 'app-patient-schedule',
  templateUrl: './patientschedule.component.html',
  styleUrls: ['./patientschedule.component.css']
})
export class PatientScheduleComponent implements OnInit {
  showUpcoming: boolean = true; // Control toggle between upcoming and past appointments

  patient = {
    appointments: {
      upcoming: [] as Appointment[],
      past: [] as Appointment[]
    }
  };

  doctorNames: { [id: number]: string } = {}; // Dictionary to store doctor names
  isLoading: boolean = true; 

  patientId!: number; 

  constructor(private appointmentService: AuthService, private doctorService: DoctorserviceService) {}

  ngOnInit(): void {
    this.getUserIdFromLocalStorage();
    this.fetchAppointments();
  }

  getUserIdFromLocalStorage(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.patientId = Number(storedUserId);
    } else {
      console.error('User ID not found in local storage');
    }
  }

  fetchAppointments(): void {
    if (this.patientId) {
      this.appointmentService.getUpcomingAppointments(this.patientId).subscribe(
        (upcomingAppointments) => {
          this.patient.appointments.upcoming = upcomingAppointments;
          this.checkAndFetchDoctorNames();
        },
        (error) => {
          console.error('Error fetching upcoming appointments', error);
        }
      );

      this.appointmentService.getPreviousAppointments(this.patientId).subscribe(
        (pastAppointments) => {
          this.patient.appointments.past = pastAppointments;
          this.checkAndFetchDoctorNames();
        },
        (error) => {
          console.error('Error fetching past appointments', error);
        }
      );
    }
  }

  // Method to fetch doctor names for all unique doctor IDs
  checkAndFetchDoctorNames(): void {
    const allAppointments = [...this.patient.appointments.upcoming, ...this.patient.appointments.past];
    const doctorIds = Array.from(new Set(allAppointments.map((appointment) => appointment.doctorId)));

    // Fetch doctor details in a single API call or sequentially if needed
    doctorIds.forEach((id) => {
      if (id && !this.doctorNames[id]) {
        this.doctorService.getDoctorById(id).subscribe(
          (doctor) => {
            this.doctorNames[id] = `${doctor.firstName} ${doctor.lastName}`;
            this.assignDoctorNames(); // Re-assign doctor names once the details are fetched
          },
          (error) => {
            console.error(`Error fetching doctor details for ID: ${id}`, error);
          }
        );
      }
    });
  }

  // Assigns doctor names to appointments based on the doctorId
  assignDoctorNames(): void {
    const updateNames = (appointments: Appointment[]) => {
      appointments.forEach((appointment) => {
        if (appointment.doctorId && this.doctorNames[appointment.doctorId]) {
          appointment.doctorName = this.doctorNames[appointment.doctorId];
        }
      });
    };
    updateNames(this.patient.appointments.upcoming);
    updateNames(this.patient.appointments.past);
    this.isLoading = false; //to assign names 
  }

  toggleAppointments(upcoming: boolean) {
    this.showUpcoming = upcoming;
  }
}
