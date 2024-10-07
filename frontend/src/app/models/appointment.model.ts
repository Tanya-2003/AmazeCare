export interface Appointment {
    appointmentId: number;      
    patientId: number;          
    doctorId: number;           
    appointmentDate: string;    
    status: string;             
    remarks: string;            
    doctorName?: string; 
  }