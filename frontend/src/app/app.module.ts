import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Import BrowserAnimationsModule for animations
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule for API calls

// import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';


import { AppComponent } from './app.component';
import { AppRoutesModule } from './app.routes';  // Import the routing module
import { SharedModule } from './shared/shared.module';  // SharedModule for shared components like footer, header, etc.
import { DoctorModule } from './doctor/doctor.module';  // Import DoctorModule for doctor-related components
import { HomeModule } from './home/home.module';  // Import HomeModule for home-related components

// Angular Material modules
import { MatInputModule } from '@angular/material/input';  // Material input UI component
import { MatButtonModule } from '@angular/material/button';  // Material button UI component
import { MatCheckboxModule } from '@angular/material/checkbox';  // Material checkbox UI component
import { MatFormFieldModule } from '@angular/material/form-field';  // Material form field UI component
import { MatIconModule } from '@angular/material/icon';  // Material icon UI component

// Forms
import { ReactiveFormsModule } from '@angular/forms';  // Forms module for reactive forms
//chart
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent,
    // AdminDashboardComponent,
    // Other components that are declared here if needed
  ],
  imports: [
    NgxChartsModule,
    
    BrowserModule,         // BrowserModule is required for Angular applications to run in a browser
    BrowserAnimationsModule,  // Provides support for animations (necessary for Angular Material animations)
    HttpClientModule,      // HttpClientModule for API calls
    AppRoutesModule,       // Use AppRoutesModule for routing
    SharedModule,          // SharedModule for shared components (footer, header, etc.)
    ReactiveFormsModule,   // Forms module for reactive forms

    // ChartsModule,
    // Angular Material modules
    MatInputModule,        // Material input UI component
    MatButtonModule,       // Material button UI component
    MatCheckboxModule,     // Material checkbox UI component
    MatFormFieldModule,    // Material form field UI component
    MatIconModule,         // Material icon UI component

    HomeModule,            // Home module
    DoctorModule,          // Doctor module

  ],
  bootstrap: [AppComponent],
  providers: [
    // No need for `provideAnimationsAsync()`, use `BrowserAnimationsModule` instead for enabling animations
  ]
})
export class AppModule { }
