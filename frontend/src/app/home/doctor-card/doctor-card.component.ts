import { Component, OnInit, HostListener, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorserviceService } from '../../services/doctorservice.service';
import { AdminService } from '../../services/admin.service';
import { DoctorRegisterDTO } from '../../models/DoctorRegisterDTO.model'; // Import your models
import {DoctorDetail} from '../../models/doctordetail.model';

@Component({
  selector: 'app-doctor-card',
  templateUrl: './doctor-card.component.html',
  styleUrls: ['./doctor-card.component.scss'],
})
export class DoctorCardComponent implements OnInit {
  selectedSpeciality: string = '';
  sortOrder: string = 'asc';
  doctors: (DoctorRegisterDTO & DoctorDetail)[] = []; // Updated type
  filteredDoctors: any[] = []; // Adjusted type for filtered doctors
  currentCount = 6;
  loading = false;
  endMessage: string = '';
  endReached = false;

  specialities: string[] = []; // Declare the property

  //04-10
  @Output() doctorSelected = new EventEmitter<any>();
  @Input() doctor: { name: string; doctorId: number } | undefined; // Add doctorId here

  
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

  specialityImageMapping: { [key: string]: string } = {
    'Cancer-Care': 'assets/doctor-card/cancer-care.png',
    'Cardiology': 'assets/doctor-card/cardiology.png',
    'Newborn-Services': 'assets/doctor-card/newborn-services.png',
    'Dental-Care': 'assets/doctor-card/dental-care.png',
    'General-Surgery': 'assets/doctor-card/general-surgery.png',
    'Kidney-Care': 'assets/doctor-card/kidney-care.png',
    'Long-Term-Acute-Care': 'assets/doctor-card/long-term-acute-care.png',
    'Neurosurgery': 'assets/doctor-card/neurosurgery.png',
    'Radiation-Oncology': 'assets/doctor-card/radiation-oncology.png',
    'Stroke-Care': 'assets/doctor-card/stroke-care.png',
    'Women-Health': 'assets/doctor-card/women-health.png',
    'Default': 'assets/default-department.png', // Optional default image
  };

  constructor(private doctorService: DoctorserviceService, private router: Router, private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.loadSpecialities(); // Load specialities if needed
  }

  loadDoctors() {
    this.adminService.getDoctors().subscribe((doctorData: DoctorRegisterDTO[]) => {
      const doctorDetailsPromises = doctorData.map(doctor => {
        if (doctor.doctorId) {
          return this.doctorService.getDoctorDetailsById(doctor.doctorId).toPromise()
            .then((doctorDetail: DoctorDetail | undefined) => {
              if (doctorDetail) {
                // const fullDoctorDetails = {
                //   ...doctor,
                //   ...doctorDetail,
                //   name: `${doctor.firstName} ${doctor.lastName}`,
                //   departmentAvatar: this.specialityImageMapping[doctor.specialisation] || this.specialityImageMapping['Default'],
                //   image: this.doctorImageMapping[`${doctor.firstName}`] || 'assets/default-doctor-image.png',
                // };
                
                // // Log the fetched doctor details including specialization name
                // console.log('Fetched Doctor Details:', fullDoctorDetails);
                
                // return fullDoctorDetails;
                const mappedAvatar = this.specialityImageMapping[doctor.specialisation] || this.specialityImageMapping['Default'];
              console.log(`Mapping Specialisation '${doctor.specialisation}' to Avatar:`, mappedAvatar);

              const fullDoctorDetails = {
                ...doctor,
                ...doctorDetail,
                name: `${doctor.firstName} ${doctor.lastName}`,
                departmentAvatar: mappedAvatar,
                image: this.doctorImageMapping[`${doctor.firstName}`] || 'assets/default-doctor-image.png',
              };
              
              console.log('Fetched Doctor Details:', fullDoctorDetails);
              return fullDoctorDetails;
              } else {
                console.warn(`No details found for doctorId: ${doctor.doctorId}`);
                return null; // Return null if no details are found
              }
            })
            .catch(error => {
              console.error(`Error fetching details for doctorId: ${doctor.doctorId}`, error);
              return null; // Handle error case
            });
        } else {
          console.warn(`doctorId is undefined for doctor: ${doctor.firstName} ${doctor.lastName}`);
          return Promise.resolve(null); // Return null if doctorId is not defined
        }
      });
  
      Promise.all(doctorDetailsPromises).then((doctorsWithDetails) => {
        this.doctors = doctorsWithDetails.filter(doctor => doctor !== null) as (DoctorRegisterDTO & DoctorDetail)[];
        this.loadInitialDoctors();
      });
    });
  }
  
  loadSpecialities() {
    // Example: Load specialities from a service or define statically
    this.specialities = ['Cancer Care', 'Cardiology', 'Pediatrician',
     'Dental Care', 'General Surgery', 'Kidney Care',
     'Long Term Acute Care', 'Neurosurgery', 'Radiation Oncology',
     'Stroke Care', 'Women Health',]; // Example static data
    // Or fetch from a service, e.g., this.adminService.getSpecialities().subscribe(...)
  }

  loadInitialDoctors() {
    this.filteredDoctors = this.doctors.slice(0, this.currentCount);
    this.endMessage = '';
    this.endReached = false;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const bottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1;
    if (bottom && !this.loading && !this.endReached) {
      this.loadMoreDoctors();
    }
  }

  loadMoreDoctors() {
    this.loading = true;
    setTimeout(() => {
      const moreDoctors = this.doctors.slice(this.currentCount, this.currentCount + 6);
      if (moreDoctors.length) {
        this.filteredDoctors.push(...moreDoctors);
        this.currentCount += 6;
        this.endMessage = '';
      } else {
        this.endMessage = 'You have reached the end';
        this.endReached = true;
      }
      this.loading = false;
    }, 3000);
  }

  filterDoctors() {
    if (this.selectedSpeciality) {
      this.filteredDoctors = this.doctors.filter((doc) => doc.specialisation === this.selectedSpeciality).slice(0, this.currentCount);
      this.endMessage = '';
      this.endReached = false;
    } else {
      this.loadInitialDoctors();
    }
  }

  sortDoctors() {
    this.filteredDoctors.sort((a, b) => {
      return this.sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
  }

  selectDoctor(doctor: any) {
    // this.doctorSelected.emit(doctor);
    this.doctorSelected.emit(doctor);
    this.goToDoctorDetails(doctor.doctorId)
  }

  goToDoctorDetails(doctorId: number) { // Change parameter type to number
      // this.router.navigate(['/doctor-details'], { queryParams: { id: doctorId } });
      this.router.navigate(['/doctor-details', doctorId]); // Navigate to the details page with the ID
  }
}
