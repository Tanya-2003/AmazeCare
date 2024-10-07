import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { HeroComponent } from './hero/hero.component';
import { DoctorCardComponent } from './doctor-card/doctor-card.component';
import { HomeComponent } from './home.component';
import { homeRoutes } from './home.routes';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [
    HeroComponent,
    DoctorCardComponent,
    HomeComponent
  ],
  imports: [
    MatIconModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(homeRoutes) // Make sure this is included
  ],
  exports: [
    HeroComponent,
    DoctorCardComponent
  ]
})
export class HomeModule { }
