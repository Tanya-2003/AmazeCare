import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AmazeCare';
  currentPage: string = 'home';
  selectedDoctor: any = null;
  isLoginPage: boolean = false;
  isSignupPage: boolean = false;
  isDoctorDetailsPage: boolean = false;
  isDashboardRoute: boolean = false;  // Track if the current route is a dashboard route

  constructor(private router: Router) {
    // Listen to route changes to update the current page status
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkCurrentPage(event.urlAfterRedirects);
    });
  }

  // Function to check if the current route is login, signup, doctor-details, or dashboard
  private checkCurrentPage(url: string) {
    this.isLoginPage = url.includes('/auth/login');
    this.isSignupPage = url.includes('/auth/signup');
    this.isDoctorDetailsPage = url.includes('/doctor-details');
    
    // Set isDashboardRoute to true if the URL starts with /dashboard
    this.isDashboardRoute = url.startsWith('/dashboard');

    // Reset selected doctor when not on the doctor details page
    if (!this.isDoctorDetailsPage) {
      this.selectedDoctor = null;
    }
  }

  // Handle doctor selection and navigate to doctor-details page with query params
  onDoctorSelected(doctor: any) {
    this.selectedDoctor = doctor;
    const encodedName = encodeURIComponent(doctor.name);
    this.router.navigate(['/doctor-details'], { queryParams: { name: encodedName } });
  }

  // Navigate to the patient dashboard
  navigateToDashboard() {
    this.router.navigate(['/dashboard/patient-dashboard']);
  }
}
