import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';  // Ensure both FormsModule and ReactiveFormsModule are imported
import { RouterModule } from '@angular/router';  // Import RouterModule
import { PatientprofileComponent } from './patient-dashboard/patientprofile/patientprofile.component';
import { SidebarComponent } from './patient-dashboard/sidebar/sidebar.component'; // Import SidebarComponent
import { ReactiveFormsModule } from '@angular/forms';

// Dashboard components
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
//import { SidebarComponent } from './patient-dashboard/sidebar/sidebar.component';
import { DoctorSidebarComponent } from './doctor-dashboard/doctor-sidebar/doctor-sidebar.component';
import { DoctorscheduleComponent } from './doctor-dashboard/doctorschedule/doctorschedule.component';
import { DoctorprofileComponent } from './doctor-dashboard/doctorprofile/doctorprofile.component';
import { DoctorrecordComponent } from './doctor-dashboard/doctorrecord/doctorrecord.component';
//import { PatientProfileComponent } from './patient-dashboard/patientprofile/patientprofile.component'; 
import { PatientmedicationComponent } from './patient-dashboard/patientmedication/patientmedication.component';
import { PatientScheduleComponent } from './patient-dashboard/patientschedule/patientschedule.component';
import { PatienthealthrecordComponent } from './patient-dashboard/patienthealthrecord/patienthealthrecord.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { AdminAppointmentComponent } from './admin-dashboard/admin-appointment/admin-appointment.component';
import { AdminPatientComponent } from './admin-dashboard/admin-patient/admin-patient.component';
import { AdminDoctorComponent } from './admin-dashboard/admin-doctor/admin-doctor.component';
import { AdminRecordComponent } from './admin-dashboard/admin-record/admin-record.component';
import { AdminSidebarComponent } from './admin-dashboard/admin-sidebar/admin-sidebar.component';
import { AdminBillingComponent } from './admin-dashboard/admin-billing/admin-billing.component';

// Angular Material modules
import { MatInputModule } from '@angular/material/input';  // Material input UI component
import { MatButtonModule } from '@angular/material/button';  // Material button UI component
import { MatCheckboxModule } from '@angular/material/checkbox';  // Material checkbox UI component
import { MatFormFieldModule } from '@angular/material/form-field';  // Material form field UI component
import { MatIconModule } from '@angular/material/icon';  // Material icon UI component
import { MatDatepickerModule } from '@angular/material/datepicker';  // Material datepicker UI component
import { MatNativeDateModule } from '@angular/material/core';  // Datepicker adapter for native JS Date
import {  BaseChartDirective } from 'ng2-charts';

// import { NgChartsModule } from 'ng2-charts'; // Use this for version 6

@NgModule({
  declarations: [
    PatientDashboardComponent,
    DoctorDashboardComponent,
    AdminDashboardComponent,
    PatientprofileComponent,
    PatientmedicationComponent,
    PatientScheduleComponent,
    PatienthealthrecordComponent,
    SidebarComponent,
    DoctorSidebarComponent,
    DoctorscheduleComponent,
    DoctorprofileComponent,
    DoctorrecordComponent,
    AdminAppointmentComponent,
    AdminPatientComponent,
    AdminDoctorComponent,
    AdminRecordComponent,
    AdminSidebarComponent,
    AdminBillingComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,   // Forms module for reactive forms
    RouterModule,
    BaseChartDirective,
    // Angular Material modules
    MatInputModule,        // Material input UI component
    MatButtonModule,       // Material button UI component
    MatCheckboxModule,     // Material checkbox UI component
    MatFormFieldModule,    // Material form field UI component
    MatIconModule,         // Material icon UI component
    MatDatepickerModule,   // Material datepicker UI component
    MatNativeDateModule,   // Date adapter for datepicker using JS Date objects
  ],
  exports: [
    PatientDashboardComponent,
    DoctorDashboardComponent,
    AdminDashboardComponent,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
