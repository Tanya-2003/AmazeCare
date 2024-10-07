import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Adjust the path according to your project structure
import { AdminService } from '../../services/admin.service';
import { Chart, registerables } from 'chart.js';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss'],
})
export class PatientDashboardComponent implements OnInit {

  showUpcoming: boolean = true;
  patientId: number //= +localStorage.getItem('patientId'); // Fetch patient ID from local storage
  patient: any = {};
  medicalRecords: any[] = [];
  upcomingAppointments: any[] = [];
  previousAppointments: any[] = [];
  medications: any[] = [];

  //03-10
  isLoggedIn: boolean = false;
  patientName: string | null = '';
  userId: string | null = '';

  @ViewChild('appointmentStatusPieChart') appointmentStatusPieChart!: ElementRef;
  @ViewChild('appointmentsOverTimeBarChart') appointmentsOverTimeBarChart!: ElementRef;
  @ViewChild('medicinesFrequencyBarChart') medicinesFrequencyBarChart!: ElementRef;
  @ViewChild('appointmentsStatusStackedBarChart') appointmentsStatusStackedBarChart!: ElementRef;


  constructor(private patientService: AuthService, private adminService: AdminService,private changeDetector: ChangeDetectorRef) {
    const patientIdString = localStorage.getItem('userId'); // Change to 'userId'
    this.patientId = patientIdString ? +patientIdString : 0; // Default to 0 if null

    //03-10
    this.userId = patientIdString; // Assuming you have the userId stored in the same way
    Chart.register(...registerables);
}

  ngOnInit() {
    this.getPatientInfo();
    this.getMedicalRecords();
    this.getUpcomingAppointments();
    this.getPreviousAppointments();
    this.getMedications();
    this.fetchAppointments;

    //03-10
    this.fetchPatientName(); // Call fetchPatientName to get the full name
    this.getUserIdFromLocalStorage();
    this.loadPatientData();
  }

  loadPatientData(): void {
    this.patientService.getPatientInfo(this.patientId).subscribe(data => {
      this.patient = data;
      this.createCharts(); // Create charts after patient info is loaded
      this.getMedicalRecords();
      this.fetchAppointments();
      this.getMedications();
    });

    // Fetch other data needed for charts
   
  }

  getUserIdFromLocalStorage(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.patientId = Number(storedUserId);
    } else {
      console.error('User ID not found in local storage');
      // Handle missing user ID appropriately
    }
  }
  // toggleAppointments(upcoming: boolean) {
  //   this.showUpcoming = upcoming;
  // }
  toggleAppointments(upcoming: boolean) {
    this.showUpcoming = upcoming;
  }

  private fetchAppointments(): void {
    if (this.patientId) {
      this.patientService.getUpcomingAppointments(this.patientId).subscribe(
        (upcomingAppointments) => {
          console.log('Upcoming Appointments:', upcomingAppointments); // Check data
          this.upcomingAppointments = upcomingAppointments; // Store the data
        },
        (error) => {
          console.error('Error fetching upcoming appointments', error);
        }
      );

      this.patientService.getPreviousAppointments(this.patientId).subscribe(
        (pastAppointments) => {
          console.log('Past Appointments:', pastAppointments); // Check data
          this.previousAppointments = pastAppointments; // Store the data
        },
        (error) => {
          console.error('Error fetching past appointments', error);
        }
      );
    }
  }

  private getPatientInfo() {
    this.patientService.getPatientInfo(this.patientId).subscribe(data => {
      this.patient = data;
    });
  }

  private getMedicalRecords() {
    this.patientService.getMedicalRecords(this.patientId).subscribe(data => {
      this.medicalRecords = data;
    });
  }

  private getUpcomingAppointments() {
    this.patientService.getUpcomingAppointments(this.patientId).subscribe(data => {
      this.upcomingAppointments = data;
    });
  }

  private getPreviousAppointments() {
    this.patientService.getPreviousAppointments(this.patientId).subscribe(data => {
      this.previousAppointments = data;
    });
  }

  private getMedications() {
    this.patientService.getMedications(this.patientId).subscribe(data => {
      this.medications = data;
    });
  }

  //03-10
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

  createCharts(): void {
    this.createAppointmentStatusPieChart();
    this.createAppointmentsOverTimeBarChart();
    this.createMedicinesFrequencyBarChart();
    this.createAppointmentsStatusStackedBarChart();
  }

  createAppointmentStatusPieChart() {
    const ctx = this.appointmentStatusPieChart.nativeElement.getContext('2d');
    const completedCount = this.patient.appointments.filter((a: Appointment) => a.status === 'Completed').length;
    const cancelledCount = this.patient.appointments.filter((a: Appointment) => a.status === 'Cancelled').length;
    const rejectedCount = this.patient.appointments.filter((a: Appointment) => a.status === 'Rejected').length;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Completed', 'Cancelled', 'Rejected'],
        datasets: [{
          data: [completedCount, cancelledCount, rejectedCount],
          backgroundColor: [
            'rgba(75, 192, 192, 0.5)', 
            'rgba(255, 99, 132, 0.5)', 
            'rgba(54, 162, 235, 0.5)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)', 
            'rgba(255, 99, 132, 1)', 
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }

  createAppointmentsOverTimeBarChart() {
    const ctx = this.appointmentsOverTimeBarChart.nativeElement.getContext('2d');
    const labels: string[] = []; // Populate with dates
    const appointmentCounts: number[] = []; // Populate with counts

    // Example logic to fill labels and appointmentCounts
    const allAppointments = [...this.upcomingAppointments, ...this.previousAppointments];
    const groupedAppointments = this.groupAppointmentsByDate(allAppointments);

    Object.keys(groupedAppointments).forEach(date => {
      labels.push(date);
      appointmentCounts.push(groupedAppointments[date].length);
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Appointments Over Time',
          data: appointmentCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }

  createMedicinesFrequencyBarChart() {
    const ctx = this.medicinesFrequencyBarChart.nativeElement.getContext('2d');
    const medicineNames: string[] = []; // Populate with medicine names
    const medicineCounts: number[] = []; // Populate with counts

    const medicineFrequency = this.getMedicineFrequency();

    Object.keys(medicineFrequency).forEach(medicine => {
      medicineNames.push(medicine);
      medicineCounts.push(medicineFrequency[medicine]);
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: medicineNames,
        datasets: [{
          label: 'Frequency of Medicines Prescribed',
          data: medicineCounts,
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }

  createAppointmentsStatusStackedBarChart() {
    const ctx = this.appointmentsStatusStackedBarChart.nativeElement.getContext('2d');
    const labels: string[] = []; // Populate with appointment dates
    const completedCounts: number[] = []; // Populate completed counts
    const cancelledCounts: number[] = []; // Populate cancelled counts
    const rejectedCounts: number[] = []; // Populate rejected counts

    // Example logic to fill labels and counts
    const allAppointments = [...this.upcomingAppointments, ...this.previousAppointments];
    const groupedByStatus = this.groupAppointmentsByStatus(allAppointments);

    Object.keys(groupedByStatus).forEach(date => {
      labels.push(date);
      completedCounts.push(groupedByStatus[date].completed.length);
      cancelledCounts.push(groupedByStatus[date].cancelled.length);
      rejectedCounts.push(groupedByStatus[date].rejected.length);
    });

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Completed',
            data: completedCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
          {
            label: 'Cancelled',
            data: cancelledCounts,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Rejected',
            data: rejectedCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          },
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }

  private groupAppointmentsByDate(appointments: any[]): Record<string, any[]> {
    return appointments.reduce((acc, appointment) => {
      const date = new Date(appointment.appointmentDate).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(appointment);
      return acc;
    }, {} as Record<string, any[]>);
  }

  private getMedicineFrequency(): Record<string, number> {
    return this.medications.reduce((acc, medication) => {
      const name = medication.name;
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupAppointmentsByStatus(appointments: any[]): Record<string, any> {
    return appointments.reduce((acc, appointment) => {
      const date = new Date(appointment.appointmentDate).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { completed: [], cancelled: [], rejected: [] };
      }
      acc[date][appointment.status.toLowerCase()].push(appointment);
      return acc;
    }, {} as Record<string, any>);
  }

}
