import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  //03-10
  isLoggedIn: boolean = false;
  patientName: string | null = '';
  userId: string | null = '';

  constructor(private router: Router, private adminService: AdminService,private changeDetector: ChangeDetectorRef ) {}

  //03-10
  ngOnInit(): void {
    // Check if the user is logged in by verifying if `userId` is present in local storage
    // this.userId = localStorage.getItem('userId');
    // if (this.userId) {
    //   this.isLoggedIn = true;
    //   this.fetchPatientName();
    // }

    //03-10
    this.userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    if (this.userId && role === 'Patient') {
      this.isLoggedIn = true;
      this.fetchPatientName();
    }
  }

  // Method to fetch the patient name based on the stored `userId`
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
  
  // Navigate to the dashboard
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard/patientprofile']);
  }

  // Logout the user
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.isLoggedIn = false;
    this.patientName = ''; // Reset the patient name
    this.router.navigate(['/home']);
  }

  //old
  // Method to navigate to login page
  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  // Method to navigate to signup page
  navigateToSignup() {
    this.router.navigate(['/auth/signup']);
  }
}
