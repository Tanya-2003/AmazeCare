import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-doctor-sidebar',
  templateUrl: './doctor-sidebar.component.html',
  styleUrl: './doctor-sidebar.component.scss'
})
export class DoctorSidebarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  onLogout() {
    this.authService.logout(); // Call the logout method to remove token
    this.router.navigate(['/auth/login']); // Redirect to the login page
  }
}
