import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent {

  constructor(private authService: AuthService, private router: Router) {}

  onLogout() {
    this.authService.logout(); // Call the logout method to remove token
    this.router.navigate(['/auth/login']); // Redirect to the login page
  }
}
