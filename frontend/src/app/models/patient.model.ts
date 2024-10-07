export interface Patient {
    patientId?: number; // Make it optional
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    address: string;
    bloodGroup: string;
    knownAllergies: string;
    currentMedication: string;
    username:string,
    password:string,
    diagnosis?: string;  // Diagnosis field to display in the table
    age?: number;
    image?: string;
    patientName?:string,
  }