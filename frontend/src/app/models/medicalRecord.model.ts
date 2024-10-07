export interface MedicalRecord {
    recordId?: number;
    patientId: number;
    doctorId: number;
    appointmentId: number;
    diagnosis: string;
    medicineName: string;
    medicineFrequency: string;
    medicineTime: string;
    treatmentPlan: string;
    nextAppointmentDate: string; // Keep this in "yyyy-MM-dd" format
    insuranceCoverage: string;
    // optional properties
    patientName?: string;  // Keep this optional
    doctorName?: string;   // Keep this optional
    appointmentDate?: string;
}