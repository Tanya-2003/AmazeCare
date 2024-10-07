export interface DoctorRegisterDTO {
    image?: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string; // or string depending on your data
    specialisation: string;
    yearsOfExperience: number;
    phoneNumber: string;
    secondaryPhoneNumber?: string; // optional field
    licenseNumber: string;
    username: string;
    password: string;
    email: string;
    doctorId?: number;
  }
  