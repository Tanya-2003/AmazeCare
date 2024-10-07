import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DoctorRegisterDTO } from '../models/DoctorRegisterDTO.model';
import { Patient } from '../models/patient.model';
import { MedicalRecord } from '../models/medicalRecord.model';
import { Appointment } from '../models/appointment.model';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  
  private apiUrl = 'https://localhost:7260/api';

  constructor(private http: HttpClient) {}

  // Fetch all doctors
  getDoctors(): Observable<DoctorRegisterDTO[]> {
    return this.http.get<DoctorRegisterDTO[]>(`${this.apiUrl}/Admin/doctors`);
  }

  // Fetch all patients
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/Admin/patients`);
  }

  // Fetch all medical records
  getMedicalRecords(): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${this.apiUrl}/Admin/medicalrecords`);
  }

  // Fetch all appointments
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/Admin/appointments`);
  }

  // Fetch medical records by patientId
  getMedicalRecordsByPatientId(patientId: number) {
    return this.http.get<MedicalRecord[]>(`${this.apiUrl}/MedicalRecords/patient/${patientId}`);
  }

  // Fetch appointment by appointment ID
  getAppointmentById(appointmentId: number) {
    return this.http.get<Appointment>(`${this.apiUrl}/Appointments/${appointmentId}`);
  }

  // Method to fetch a patient by ID
  getPatientById(patientId: number): Observable<Patient> {
    const url = `${this.apiUrl}/Admin/patient/${patientId}`;
    return this.http.get<Patient>(url, {
      headers: new HttpHeaders({
        'accept': '*/*'
      })
    });
  }

  // Method to fetch a doctor by ID
  getDoctorById(doctorId: number): Observable<DoctorRegisterDTO> {
    const url = `${this.apiUrl}/Doctors/${doctorId}`;
    return this.http.get<DoctorRegisterDTO>(url, {
      headers: new HttpHeaders({
        'accept': '*/*'
      })
    });
  }

  // Fetch multiple doctors by IDs
  getDoctorsByIds(doctorIds: number[]): Observable<DoctorRegisterDTO[]> {
    const requests = doctorIds.map(id => this.getDoctorById(id));
    return forkJoin(requests);
  }

  // Fetch multiple patients by IDs
  getPatientsByIds(patientIds: number[]): Observable<Patient[]> {
    const requests = patientIds.map(id => this.getPatientById(id));
    return forkJoin(requests);
  }

  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/Admin/patient`, patient);
  }

  updatePatient(patientId: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/Admin/patient/${patientId}`, patient);
  }

  deletePatient(patientId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Admin/patient/${patientId}`);
  }
  // Add a new doctor
  addDoctor(doctor: DoctorRegisterDTO): Observable<DoctorRegisterDTO> {
    return this.http.post<DoctorRegisterDTO>(`${this.apiUrl}/Admin/doctor`, doctor);
  }

  // Update an existing doctor
  updateDoctor(doctorId: number, doctor: DoctorRegisterDTO): Observable<DoctorRegisterDTO> {
    return this.http.put<DoctorRegisterDTO>(`${this.apiUrl}/Doctors/${doctorId}`, doctor);
  }

  // Delete a doctor
  deleteDoctor(doctorId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Admin/doctor/${doctorId}`);
  }

  // Method to add a new appointment
  addAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/Admin/appointment`, appointment);
  }

  // Method to update an existing appointment
  updateAppointment(appointmentId: number, appointment: Appointment): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Admin/appointment/${appointmentId}`, appointment);
  }

  // Method to delete an appointment
  deleteAppointment(appointmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Admin/appointment/${appointmentId}`);
  }

  // Method to add a new medical record
  addRecord(record: MedicalRecord): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(`${this.apiUrl}/Admin/medicalrecord`, record);
  }

  // Method to update an existing medical record
  updateRecord(recordId: number, record: MedicalRecord): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Admin/medicalrecord/${record.recordId}`, record);
  }

  // Method to delete a medical record by ID
  deleteRecord(recordId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Admin/medicalrecord/${recordId}`);
  }

  // Get statistics
  getStatistics(): Observable<any> {
    return forkJoin({
      patients: this.http.get<Patient[]>(`${this.apiUrl}/Admin/patients`), 
      doctors: this.http.get<DoctorRegisterDTO[]>(`${this.apiUrl}/Admin/doctors`),     
      appointments: this.http.get<Appointment[]>(`${this.apiUrl}/Admin/appointments`), 
      records: this.http.get<MedicalRecord[]>(`${this.apiUrl}/Admin/medicalrecords`)  
    }).pipe(
      map(response => {
        const patientCount = response.patients.length;
        const doctorCount = response.doctors.length;
        const recordCount = response.records.length;

        // Aggregate appointments by month
        const appointmentsData = this.aggregateAppointmentsByMonth(response.appointments);
        const appointmentStatusCounts = this.aggregateAppointmentStatus(response.appointments);

        return {
          patientCount,
          doctorCount,
          appointmentCount: response.appointments.length,
          recordCount,
          appointmentStatusCounts,
          appointmentsData // Add aggregated data
        };
      })
    );
  }

  private aggregateAppointmentsByMonth(appointments: Appointment[]): { [key: string]: number } {
    const monthlyData: { [key: string]: number } = {}; // Define type with index signature
    
    appointments.forEach(appointment => {
      const month = new Date(appointment.appointmentDate).toLocaleString('default', { month: 'long' });
      monthlyData[month] = (monthlyData[month] || 0) + 1; // Increment count for the month
    });
    
    return monthlyData;
  }

  private aggregateAppointmentStatus(appointments: Appointment[]): any {
    const statusCounts = {
      completed: 0,
      cancelled: 0,
      rejected: 0,
    };

    appointments.forEach(appointment => {
      // Assuming appointment.status is the field that determines status
      switch (appointment.status) {
        case 'Completed':
          statusCounts.completed++;
          break;
        case 'Cancelled':
          statusCounts.cancelled++;
          break;
        case 'Rejected':
          statusCounts.rejected++;
          break;
        default:
          break;
      }
    });

    return statusCounts;
  }

  getAllBills(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Bill/all`);
  }

  getDoctorDetails(doctorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Admin/doctordetail/${doctorId}`);
  }

}
