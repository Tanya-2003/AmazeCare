// import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service'; // Adjust import as needed
import { ChartOptions, ChartType } from 'chart.js';
import { ChartData } from 'chart.js/auto';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements AfterViewInit {
  @ViewChild('barChart') barChart!: ElementRef;
  @ViewChild('pieChart') pieChart!: ElementRef;
  @ViewChild('stackedBarChart') stackedBarChart!: ElementRef;
  @ViewChild('columnChart') columnChart!: ElementRef;

  currentPage: number = 1;
  totalPages: number = 2;
  statistics: any = {
    patientCount: 0,
    doctorCount: 0,
    appointmentCount: 0,
    recordCount: 0,
  };
  paginatedStatistics: any = [];

  constructor(private adminService: AdminService) {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.loadStatistics();
  }

  // loadStatistics(): void {
  //   this.adminService.getStatistics().subscribe(
  //     (data) => {
  //       this.statistics = data;
  //       this.paginatedStatistics = [data]; // Assign data to paginatedStatistics to be used for the charts
  //       this.createPatientsAppointmentsBarChart();
  //       this.createAppointmentStatusPieChart();
  //       // this.createColumnChart();
  //       // this.createStackedBarChart();
  //     },
  //     (error) => {
  //       console.error('Error fetching statistics', error);
  //     }
  //   );
  // }

  loadStatistics(): void {
    this.adminService.getStatistics().subscribe(
      (data) => {
        this.statistics = data;
        this.paginatedStatistics = [data]; // Assign data to paginatedStatistics to be used for the charts
        this.createPatientsAppointmentsBarChart(); // Create bar chart after loading statistics
        this.createAppointmentStatusPieChart();
        // this.createColumnChart();
        // this.createStackedBarChart();
      },
      (error) => {
        console.error('Error fetching statistics', error);
      }
    );
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateCharts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateCharts();
    }
  }

  updateCharts(): void {
    if (this.currentPage === 1) {
      this.createPatientsAppointmentsBarChart();
      this.createAppointmentStatusPieChart();
    } else if (this.currentPage === 2) {
      // this.createColumnChart();
      // this.createStackedBarChart();
    }
  }

  // 1. Bar Chart: Patients and Appointments
  createPatientsAppointmentsBarChart() {
    if (this.barChart && this.barChart.nativeElement) {
      const ctx = this.barChart.nativeElement.getContext('2d');

      // Extract the dynamic data from statistics
      const patientsData = this.statistics.appointmentsData; // Assuming appointmentsData is an object with month as key
      const labels = Object.keys(patientsData); // Get the month names as labels
      const patientCounts = labels.map(month => patientsData[month]); // Get patient counts for each month
      const appointmentCounts = labels.map(month => patientsData[month]); // Get appointment counts for each month

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Patients',
              data: patientCounts, // Dynamic data for Patients
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Appointments',
              data: appointmentCounts, // Dynamic data for Appointments
              backgroundColor: 'rgba(153, 102, 255, 0.5)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: { enabled: true },
            legend: { display: true },
          },
        },
      });
    }
  }

  // 2. Pie Chart: Appointment Status
  createAppointmentStatusPieChart() {
    if (this.pieChart && this.pieChart.nativeElement) {
      const ctx = this.pieChart.nativeElement.getContext('2d');

      // Extract the appointment status counts from statistics
      const completedCount = this.statistics.appointmentStatusCounts?.completed || 0;
      const cancelledCount = this.statistics.appointmentStatusCounts?.cancelled || 0;
      const rejectedCount = this.statistics.appointmentStatusCounts?.rejected || 0;

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Completed', 'Cancelled', 'Rejected'],
          datasets: [
            {
              data: [completedCount, cancelledCount, rejectedCount], // Use dynamic data
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)', 
                'rgba(54, 162, 235, 0.5)', 
                'rgba(255, 206, 86, 0.5)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)', 
                'rgba(54, 162, 235, 1)', 
                'rgba(255, 206, 86, 1)'
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: { enabled: true },
            legend: { display: true },
          },
        },
      });
    }
  }

}
