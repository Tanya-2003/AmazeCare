import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { Patient } from '../models/patient.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //02-10
  private isLoggedIn: boolean = false; // Set this based on your login logic
  private redirectUrl: string | null = null; // Store the intended route

  // API Base URL
  private apiUrl = 'https://localhost:7260/api'; 

  constructor(private http: HttpClient, private router: Router) {}

  //login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth`, credentials);
  }
  //register
  register(patientData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Patients/Register`, patientData);
  }
  // Get patient's Medical record with their ID
  getMedicalRecords(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Patients/MedicalRecords/${patientId}`);
  }
  // Fetch medications by patient ID
  getMedications(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Patients/MedicalRecords/${patientId}`);
  }
  //Get appointments by patient id
  getAppointments(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Patients/Appointments/${patientId}`);
  }
  //Get all patients - admin dashboard
  getPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Admin/patients`);
  }
  //Get Upcoming Appointment for patient
  getUpcomingAppointments(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/Appointments/upcoming/patient/${patientId}`);
  }
  //Get Previous Appointment for patient
  getPreviousAppointments(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/Appointments/previous/patient/${patientId}`);
  }
  // Fetch patient's basic info (name and ID)
  getPatientInfo(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Patients/Profile/${patientId}`); 
  }
  //Update Patient details
  updateProfile(patientId: number, patientData: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/Patients/UpdateProfile/${patientId}`, patientData);
  }

  //02-10

  logout() {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Optionally, you can also clear other user-related data
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    // this.isLoggedIn = false; // Set login status to false
  }

  // Method to check if the user is logged in
  // checkLoginStatus(): boolean {
  //   return this.isLoggedIn; // You can replace this with your actual logic
  // }

  //04-10
  checkLoginStatus(): boolean {
    const token = localStorage.getItem('token'); 
    const isLoggedIn = !!token; 
    console.log('User is logged in:', isLoggedIn);
    return isLoggedIn;
  }

  // Method to log in the user (for demonstration)
  loginUser(role: string) {
    this.isLoggedIn = true;

    localStorage.setItem('role', role); 
    const redirectUrl = this.redirectUrl ? this.redirectUrl : this.getDefaultRedirect(role); 

    if (this.redirectUrl) {
      this.router.navigateByUrl(this.redirectUrl);
      this.redirectUrl = null; 
    } else {
      // this.router.navigate(['/']); // Navigate to a default page
      this.navigateByRole(role);
    }
  }

  private getDefaultRedirect(role: string): string {
    if (role === 'Patient') {
      return '/home';
    } else if (role === 'Doctor') {
      return '/dashboard/doctor-dashboard';
    } else if (role === 'Admin') {
      return '/dashboard/admin-dashboard';
    }
    return '/home'; // Fallback
  }

   // Method to set the redirect URL
   setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  private navigateByRole(role: string) {
    if (role === 'Patient') {
      this.router.navigate(['/home']);
    } else if (role === 'Doctor') {
      this.router.navigate(['/dashboard/doctor-dashboard']);
    } else if (role === 'Admin') {
      this.router.navigate(['/dashboard/admin-dashboard']);
    } else {
      console.error('Login failed: Unknown role.');
    }
  }
}
