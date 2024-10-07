import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorDetailsComponent } from './doctor/doctor-details/doctor-details.component';

//23
import { PatientDashboardComponent } from './dashboard/patient-dashboard/patient-dashboard.component';
import { PatientprofileComponent } from './dashboard/patient-dashboard/patientprofile/patientprofile.component';
import { PatienthealthrecordComponent } from './dashboard/patient-dashboard/patienthealthrecord/patienthealthrecord.component';
import { PatientScheduleComponent } from './dashboard/patient-dashboard/patientschedule/patientschedule.component';
import { PatientmedicationComponent } from './dashboard/patient-dashboard/patientmedication/patientmedication.component';

export const routes: Routes = [
  // Redirect the root path to /home
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Lazy-load HomeModule for the home route
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },

  // Route for doctor-details, accessed via queryParams (e.g., /doctor-details?name=...)
  { path: 'doctor-details/:id', component: DoctorDetailsComponent },

  // Lazy-load AuthModule for authentication routes (e.g., /auth/login or /auth/signup)
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  // Lazy-load the dashboard module for patient-dashboard route
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },

  // Route for doctors list, direct access via /doctors
  {
    path: 'doctors',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },

  {
    path: 'patient-dashboard',
    component: PatientDashboardComponent,
    children: [
      { path: 'profile', component: PatientprofileComponent },
      { path: 'health-record', component: PatienthealthrecordComponent },
      { path: 'schedule', component: PatientScheduleComponent },
      { path: 'medication', component: PatientmedicationComponent }
    ]
  },
  
  { path: 'dashboard/patient-dashboard', component: PatientDashboardComponent },

  // Wildcard route for handling 404 - Page Not Found
  { path: '**', redirectTo: '/home' } // Redirect to home for any unmatched routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutesModule { }
