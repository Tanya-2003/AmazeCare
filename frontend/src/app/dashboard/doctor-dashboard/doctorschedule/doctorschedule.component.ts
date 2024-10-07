import { Component, OnInit } from '@angular/core';
import {DoctorserviceService  } from '../../../services/doctorservice.service';  // Import the service
//import { Appointment } from '../../../models/appointment.model';

interface Appointment {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  status: string;
  remarks: string;
  patientName?: string;
}
@Component({
  selector: 'app-doctorschedule',
  templateUrl: './doctorschedule.component.html',
  styleUrls: ['./doctorschedule.component.scss'],
  
})
export class DoctorscheduleComponent implements OnInit {
  showUpcoming: boolean = true;
  doctorId!: number; // Initialize with a default value
  appointments: any = {
    upcoming: [],
    past: []
  };

  successMessage: string = '';  // To show the success notification
  errorMessage: string = '';    // To show error notification

  constructor(private doctorScheduleService: DoctorserviceService) {}

  ngOnInit(): void {
    //this.fetchAppointments();
    const storedDoctorId = localStorage.getItem('userId');//doctorId
    if (storedDoctorId) {
      this.doctorId = +storedDoctorId; // Convert to a number
    }
    this.fetchAppointments();
  }

  fetchAppointments(): void {
    this.doctorScheduleService.getDoctorAppointments(this.doctorId)
      .subscribe((appointments: Appointment[]) => {
        const now = new Date();
  
        this.appointments.upcoming = appointments.filter((appointment: Appointment) => new Date(appointment.appointmentDate) >= now);
        this.appointments.past = appointments.filter((appointment: Appointment) => new Date(appointment.appointmentDate) < now);
  
        // Fetch patient names for each upcoming appointment
        this.appointments.upcoming.forEach((appointment: Appointment) => {
          this.doctorScheduleService.getPatientById(appointment.patientId).subscribe(patient => {
            appointment.patientName = patient.firstName + ' ' + patient.lastName;
          });
        });
  
        // Fetch patient names for each past appointment
        this.appointments.past.forEach((appointment: Appointment) => {
          this.doctorScheduleService.getPatientById(appointment.patientId).subscribe(patient => {
            appointment.patientName = patient.firstName + ' ' + patient.lastName;
          });
        });
      });
  }
  
  toggleAppointments(upcoming: boolean): void {
    this.showUpcoming = upcoming;
  }

  updateAppointmentStatus(appointmentId: number, status: string): void {
    this.doctorScheduleService.updateAppointmentStatus(appointmentId, status).subscribe(() => {
      this.successMessage = `Appointment ${appointmentId} updated to status: ${status}`;
      setTimeout(() => {
        this.successMessage = ''; // Clear the message after 3 seconds
      }, 3000);
    });
  }

  // Clear the notification messages after 3 seconds
  clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }
}
