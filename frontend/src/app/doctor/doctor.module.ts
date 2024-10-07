import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DoctorDetailsComponent,
    AppointmentFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,  // For handling forms
    ReactiveFormsModule
  ],
  exports: [
    DoctorDetailsComponent,
    AppointmentFormComponent
  ]
})
export class DoctorModule { }