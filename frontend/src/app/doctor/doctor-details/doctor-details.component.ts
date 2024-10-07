import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorserviceService } from '../../services/doctorservice.service';
import { AuthService } from '../../services/auth.service';
import { DoctorRegisterDTO } from '../../models/DoctorRegisterDTO.model'; // Model for basic info
import { DoctorDetail } from '../../models/doctordetail.model'; // Model for detailed info

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css']
})
export class DoctorDetailsComponent implements OnInit {
  doctor: DoctorRegisterDTO | null = null; // For basic info
  doctorDetails: DoctorDetail | null = null; // For detailed info
  showForm: boolean = false;

  loading: boolean = true; // Add loading state

  // Mapping for doctor images based on name
  doctorImageMapping: { [key: string]: string } = {
    'Shaun': 'assets/doctor-card/shawn.jpeg',
    'Claire': 'assets/doctor-card/claire.jpeg',
    'Neil': 'assets/doctor-card/niel.jpg',
    'Audrey': 'assets/doctor-card/audrey.jpg',
    'Marcus': 'assets/doctor-card/marcus.jpeg',
    'Aaron': 'assets/doctor-card/aaron.jpg',
    'Morgan': 'assets/doctor-card/morgan.jpeg',
    'Jordan': 'assets/doctor-card/jordan.jpeg',
    'Alex': 'assets/doctor-card/alex.jpeg',
    'Lea': 'assets/doctor-card/lea.jpeg',
    'Carly': 'assets/doctor-card/carly.jpeg',
    'Jessica': 'assets/doctor-card/jessica.jpeg',
    'Andrews': 'assets/doctor-card/andrews.jpeg',
    'Tamara': 'assets/doctor-card/tamara.jpeg',
    'Chris': 'assets/doctor-card/chris.jpeg',
    'Sarah': 'assets/doctor-card/sarah.jpeg',
    'Bobby': 'assets/doctor-card/bobby.jpeg',
    'Sophie': 'assets/doctor-card/sophie.jpeg',
    'Ethan': 'assets/doctor-card/ethan.jpeg',
    'Gina': 'assets/doctor-card/gina.jpg',
    'Luke': 'assets/doctor-card/luke.jpeg',
    'Rachel': 'assets/doctor-card/rachel.jpg',
  };


  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorserviceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get doctorId from route parameters
    this.route.params.subscribe(params => {
      const doctorId = +params['id']; // Get the ID from the URL
      if (doctorId) {
        this.fetchDoctor(doctorId); // Fetch the doctor basic info
        this.fetchDoctorDetails(doctorId); // Fetch the doctor detailed info
      }
    });
  }

  // Fetch basic doctor info using doctorId
  fetchDoctor(doctorId: number) {
    this.doctorService.getDoctorById(doctorId).subscribe(
      (doctor: DoctorRegisterDTO) => {
        this.doctor = doctor; // Set the basic doctor info
        this.loading = false;
      },
      error => {
        console.error('Error fetching doctor:', error);
        this.loading = false;
      }
    );
  }

  // Fetch detailed doctor info using doctorId
  fetchDoctorDetails(doctorId: number) {
    this.doctorService.getDoctorDetailsById(doctorId).subscribe(
      (details: DoctorDetail) => {
        this.doctorDetails = details; // Set the detailed doctor info
      },
      error => {
        console.error('Error fetching doctor details:', error);
      }
    );
  }

  // Create a computed property for full name
  get fullName(): string {
    return this.doctor ? `${this.doctor.firstName} ${this.doctor.lastName}` : '';
  }

  // Handle doctor image retrieval
  get doctorImage(): string {
    return this.doctor && this.doctorImageMapping[this.doctor.firstName] 
      ? this.doctorImageMapping[this.doctor.firstName] 
      : 'assets/default-image-path.jpg'; // Default image if not found
  }


  scrollToForm() {
    this.showForm = true; // Show the form when button is clicked
    const formElement = document.getElementById('appointment-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Handle button click
  bookAppointment() {
    console.log('Booking appointment initiated.'); // Check if this is printed
  if (this.authService.checkLoginStatus()) {
    this.scrollToForm(); // Scroll to the appointment form
  } else {
    console.log('User is not logged in, redirecting to login page.');
    const currentUrl = this.router.url; // Get the current URL
    this.authService.setRedirectUrl(currentUrl); // Set the intended route
    this.router.navigate(['/auth/login']); // Redirect to the login page
  }
  }

}
