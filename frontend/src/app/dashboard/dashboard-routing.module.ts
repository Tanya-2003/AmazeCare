import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { PatientprofileComponent } from './patient-dashboard/patientprofile/patientprofile.component'; 
import { PatientmedicationComponent } from './patient-dashboard/patientmedication/patientmedication.component';
import { PatientScheduleComponent } from './patient-dashboard/patientschedule/patientschedule.component';
import { PatienthealthrecordComponent } from './patient-dashboard/patienthealthrecord/patienthealthrecord.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { DoctorscheduleComponent } from './doctor-dashboard/doctorschedule/doctorschedule.component';
import { DoctorprofileComponent } from './doctor-dashboard/doctorprofile/doctorprofile.component';
import { DoctorrecordComponent } from './doctor-dashboard/doctorrecord/doctorrecord.component';
import { AdminAppointmentComponent } from './admin-dashboard/admin-appointment/admin-appointment.component';
import { AdminPatientComponent } from './admin-dashboard/admin-patient/admin-patient.component';
import { AdminDoctorComponent } from './admin-dashboard/admin-doctor/admin-doctor.component';
import { AdminRecordComponent } from './admin-dashboard/admin-record/admin-record.component';
import { AdminBillingComponent } from './admin-dashboard/admin-billing/admin-billing.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SidebarComponent } from './patient-dashboard/sidebar/sidebar.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'patient-dashboard', component: PatientDashboardComponent },
  { path: 'patientprofile', component: PatientprofileComponent },
  { path: 'patientmedication', component: PatientmedicationComponent },
  { path: 'patientschedule', component: PatientScheduleComponent },
  { path: 'patienthealth-record', component: PatienthealthrecordComponent },
  { path: 'doctor-dashboard', component: DoctorDashboardComponent},
  { path: 'doctorschedule', component: DoctorscheduleComponent},
  { path: 'doctorprofile', component: DoctorprofileComponent},
  { path: 'doctorrecord', component:DoctorrecordComponent},
  { path: 'admin-dashboard', component: AdminDashboardComponent},
  { path: 'adminappointment', component: AdminAppointmentComponent},
  { path: 'adminpatient', component: AdminPatientComponent},
  { path: 'admindoctor', component: AdminDoctorComponent},
  { path: 'adminrecord', component: AdminRecordComponent},
  { path: 'adminbilling', component: AdminBillingComponent},
  {path: 'sidebar',component:SidebarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes),FormsModule,ReactiveFormsModule],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
