import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DoctorRegisterDTO } from '../models/DoctorRegisterDTO.model';
import { DoctorDetail } from '../models/doctordetail.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorserviceService {

  // API Base URL
  private apiUrl = 'https://localhost:7260/api'; 

  constructor(private http: HttpClient) {}

  //login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth`, credentials);
  }
  //get appointment
  getDoctorAppointments(doctorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Doctors/${doctorId}/appointments`);
  }
  //get patient by id(for name)
  getPatientById(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Patients/${patientId}`);
  }
  //update appointment status
  updateAppointmentStatus(appointmentId: number, status: string): Observable<any> {
    const url = `https://localhost:7260/api/Doctors/appointments/${appointmentId}`;
    return this.http.put<any>(url, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  // Get medical records for a doctor
  getMedicalRecords(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/MedicalRecords/doctor/${doctorId}`);
  }
  // Update medical record (PUT)
  updateMedicalRecord(recordId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/MedicalRecords/${recordId}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  // Fetch doctor by ID
  getDoctorById(id: number): Observable<DoctorRegisterDTO> {
    return this.http.get<DoctorRegisterDTO>(`${this.apiUrl}/Doctors/${id}`).pipe(
      tap((response) => console.log('Doctor Info:', response))
  );
  }

  // Update doctor details
  updateDoctor(id: number, doctor: DoctorRegisterDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Doctors/${id}`, doctor);
  }

  //get doctor details
  getDoctorDetails(): Observable<DoctorDetail[]> {
    return this.http.get<DoctorDetail[]>(`${this.apiUrl}/Admin`);
  }

  //get doctordetails by id
  getDoctorDetailsById(doctorId: number): Observable<DoctorDetail> {
    return this.http.get<DoctorDetail>(`${this.apiUrl}/Admin/doctordetail/${doctorId}`).pipe(
      tap(response => console.log('Doctor Details:', response))
  );
  }

  //04-10
  // To create booking
  createBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Bookings`, bookingData, { responseType: 'text' });
  }
}
