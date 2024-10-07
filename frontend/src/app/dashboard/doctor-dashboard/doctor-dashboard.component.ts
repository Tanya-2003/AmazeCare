import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-doctor-dashboard',
  //standalone: true,
  //imports: [],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss'
})

export class DoctorDashboardComponent implements OnInit{

  showUpcoming: boolean = true;

  //03-10
  isLoggedIn: boolean = false;
  doctorName: string | null = '';
  userId: string | null = '';
  doctor: any; // Define doctor property

  constructor(private patientService: AuthService, private adminService: AdminService,private changeDetector: ChangeDetectorRef) {
    const patientIdString = localStorage.getItem('userId'); // Change to 'userId'
    // this.doctorId = patientIdString ? +patientIdString : 0; // Default to 0 if null

    //03-10
    this.userId = patientIdString; // Assuming you have the userId stored in the same way
  }

  ngOnInit() {
    //03-10
    this.fetchDoctorName(); // Call fetchPatientName to get the full name
  }

  fetchDoctorName(): void {
    if (this.userId) {
      const numericUserId = Number(this.userId);  // Convert `userId` to a number
      this.adminService.getDoctorById(numericUserId).subscribe(
        (doctor) => {
          this.doctorName = `${doctor.firstName} ${doctor.lastName}`;
          this.changeDetector.detectChanges(); // Trigger change detection manually
        },
        (error) => {
          console.error('Failed to fetch patient name', error);
        }
      );
    }
  }

  // Toggle the appointments between upcoming and past
  toggleAppointments(upcoming: boolean) {
    this.showUpcoming = upcoming;
  }

  // Example patient data (replace with real data if necessary)
  patient = {
    appointments: {
      upcoming: [
        {
          date: { month: 'October', date: 5, time: '10:00 AM' },
          symptom: 'Back pain',
          category: 'New check-up',
          doctor: 'Dr. John Doe',
          status: 'Confirmed'
        },
        {
          date: { month: 'October', date: 12, time: '2:30 PM' },
          symptom: 'Headache',
          category: 'Follow-up',
          doctor: 'Dr. Sarah Green',
          status: 'Waiting'
        }
      ],
      past: [
        {
          date: { month: 'September', date: 20, time: '9:00 AM' },
          symptom: 'Knee pain',
          category: 'New check-up',
          doctor: 'Dr. Emily Johnson',
          status: 'Confirmed'
        },
        {
          date: { month: 'September', date: 18, time: '11:00 AM' },
          symptom: 'Fever',
          category: 'New check-up',
          doctor: 'Dr. Mark Taylor',
          status: 'Rejected'
        }
      ]
    }
  }
  // Calendar and Time data
  selectedDate: Date | null = null;
  selectedTime: string = '';
  // Doctor's profile data
  starRating: number = 4.5;
  status: string = 'Online'; // Indicates the online status with the green dot

  info = {
    price: '$150',
    experience: '8 years',
    patientsTreated: 900,
    image: 'assets/doctor-card/charlie.jpg'
  };


  medicalRecords = [
    {
      date: '2023-08-10',
      symptoms: 'Headache, Dizziness, Fatigue',
      doctor: 'Dr. Jane Smith'
    },
    {
      date: '2023-05-22',
      symptoms: 'Cough, Fever, Shortness of breath',
      doctor: 'Dr. Emily Johnson'
    },
    {
      date: '2022-12-15',
      symptoms: 'Joint pain, Muscle ache',
      doctor: 'Dr. Mark Taylor'
    }
  ];

}
