import { ChangeDetectorRef, Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AdminService } from '../../../services/admin.service';
import { firstValueFrom } from 'rxjs'; 

@Component({
  selector: 'app-admin-billing',
  templateUrl: './admin-billing.component.html',
  styleUrls: ['./admin-billing.component.scss']
})
export class AdminBillingComponent {
  billingData: any[] = [];
  filteredBillingData: any[] = [];
  selectedBill: any = null;
  searchQuery: string = '';
  sortOption: string = 'name'; // Default sort by Name
  isAscending = true;

  isPdfPreviewVisible = false; // Track visibility of PDF preview
  pdfSrc: string = ''; // Use an empty string instead of undefined

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  
  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchBillingData();
  }

  async fetchBillingData(): Promise<void> {
    try {
      const bills = await firstValueFrom(this.adminService.getAllBills());
      this.billingData = bills;

      // Create patient and doctor requests and convert observables to promises
      const patientRequests = this.billingData.map(bill =>
        firstValueFrom(this.adminService.getPatientById(bill.patientId))
      );
      const doctorRequests = this.billingData.map(bill =>
        firstValueFrom(this.adminService.getDoctorById(bill.doctorId))
      );

      // Resolve patient data
      const patients = await Promise.all(patientRequests);
      this.billingData.forEach((bill, index) => {
        const patient = patients[index];
        if (patient) {
          bill.name = `${patient.firstName} ${patient.lastName}`; // Patient full name
          bill.gender = patient.gender; // Store gender
          bill.age = this.calculateAge(patient.dateOfBirth); // Calculate and store age
        } else {
          bill.name = 'Unknown';
        }
      });

      // Resolve doctor data
      const doctors = await Promise.all(doctorRequests);
      this.billingData.forEach((bill, index) => {
        const doctor = doctors[index];
        bill.doctorName = doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown';
      });

      // Store filtered data for display and update total pages
      this.filteredBillingData = [...this.billingData];
      this.totalPages = Math.ceil(this.filteredBillingData.length / this.itemsPerPage);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    }
  }

  // trackByBill(index: number, bill: any): any {
  //   return bill ? bill.bill.billNumber : undefined;
  // }

  // Calculate age from date of birth
  calculateAge(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const ageDiffMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  loadNamesForBillingData(): void {
    const patientRequests = this.billingData.map(bill =>
      this.adminService.getPatientById(bill.patientId).toPromise()
    );

    const doctorRequests = this.billingData.map(bill =>
      this.adminService.getDoctorById(bill.doctorId).toPromise()
    );

    Promise.all(patientRequests).then(patients => {
      this.billingData.forEach((bill, index) => {
        const patient = patients[index];
        bill.name = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
      });

      Promise.all(doctorRequests).then(doctors => {
        this.billingData.forEach((bill, index) => {
          const doctor = doctors[index];
          bill.doctorName = doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown';
        });

        this.filteredBillingData = [...this.billingData]; // Update filtered data
        this.totalPages = Math.ceil(this.filteredBillingData.length / this.itemsPerPage);
      });
    });
  }

  // Select bill function
  selectBill(bill: any) {
    this.selectedBill = bill;
  }

  // Helper function to access nested properties
  getProperty(obj: any, path: string) {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }

  // Search function
  searchBillingData() {
    const query = this.searchQuery.toLowerCase();
    this.filteredBillingData = this.billingData.filter(bill => {
      const nameMatch = bill.name.toLowerCase().includes(query);
      const billIdMatch = bill.bill.appointmentId.toLowerCase().includes(query);
      return nameMatch || billIdMatch;
    });
    console.log('Filtered Billing Data Length after Search:', this.filteredBillingData.length);
    this.sortBillingData(); // Re-sort after filtering
    this.currentPage = 1; // Reset to first page after search
    this.totalPages = Math.ceil(this.filteredBillingData.length / this.itemsPerPage);
    this.cdr.detectChanges();
  }

  // Sorting function
  sortBillingData() {
    const order = this.isAscending ? 1 : -1;
    this.filteredBillingData.sort((a, b) => {
      const aValue = this.getProperty(a, this.sortOption);
      const bValue = this.getProperty(b, this.sortOption);
      if (aValue > bValue) return 1 * order;
      if (aValue < bValue) return -1 * order;
      return 0;
    });
    this.updatePage(); // Update page after sorting
  }

  // Toggle sorting order
  toggleSortOrder() {
    this.isAscending = !this.isAscending;
    this.sortBillingData();
  }

  // Get paginated data
  getPaginatedData(): any[] {
    console.log('Filtered Billing Data Length:', this.filteredBillingData.length);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredBillingData.length); // Ensure endIndex is within bounds
    const paginatedData = this.filteredBillingData.slice(startIndex, endIndex);
    console.log(`Page ${this.currentPage} Data:`, paginatedData);
    return paginatedData;
  }
  
  // Pagination Methods
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Update the displayed data 
  updatePage() {
    this.filteredBillingData = [...this.filteredBillingData];
    this.cdr.detectChanges();
  }


  closePdfPreview() {
    this.isPdfPreviewVisible = false; // Hide the PDF preview
    this.pdfSrc = ''; // Reset the PDF source
  }
  

  loadNamesForSelectedBill(): Promise<void> {
    const { patientId, doctorId } = this.selectedBill;
    const patientPromise = this.adminService.getPatientById(patientId).toPromise();
    const doctorPromise = this.adminService.getDoctorById(doctorId).toPromise();

    return Promise.all([patientPromise, doctorPromise]).then(([patient, doctor]) => {
      this.selectedBill.name = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
      this.selectedBill.doctorName = doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown';
    });
  }


  async createPDFDocument() {
    console.log('Creating PDF Document...'); // Debug log
    const doc = new jsPDF();
    const bill = this.selectedBill;

    console.log('Selected Bill:', bill); // Log the selected bill

    // Fetch doctor details to get consultation fee
    let consultationFee: number;
    try {
        const doctorDetails = await firstValueFrom(this.adminService.getDoctorDetails(bill.doctorId));
        consultationFee = doctorDetails.consultationFee;
        console.log('Consultation Fee fetched:', consultationFee); // Debug log
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        consultationFee = 0; // Default to 0 or handle as needed
    }

    doc.setFontSize(16);
    doc.text('Billing Details', 15, 10);
    doc.setFontSize(12);
    doc.text(`Bill Number: ${bill.billId}`, 15, 20);
    doc.text(`Patient ID: ${bill.patientId}`, 15, 30);
    doc.text(`Patient Name: ${bill.name}`, 15, 40);
    doc.text(`Appointment ID: ${bill.appointmentId}`, 15, 50);
    doc.text(`Doctor Name: ${bill.doctorName}`, 15, 60);

    autoTable(doc, {
        startY: 70,
        head: [['Doctor ID', 'Particulars', 'Amount']],
        body: [
            [bill.doctorId, 'Consultation Fee', consultationFee.toString()],
        ],
    });

    doc.text(`Total Bill Amount: ${consultationFee}`, 15, 110);
    doc.text(`Total Amount to be Paid: ${consultationFee}`, 15, 150);

    console.log('PDF Document created successfully.'); // Debug log
    return doc;
  }

  async generatePDFPreview() {
      console.log('Generating PDF Preview...'); // Debug log
      if (!this.selectedBill) {
          alert('Please select a bill first.');
          return;
      }

      const doc = await this.createPDFDocument();
      
      // Open the PDF in a new window/tab
      const pdfUrl = doc.output('bloburl'); // Generate a blob URL for the PDF
      console.log('Generated PDF URL:', pdfUrl); // Log the generated URL
      const pdfWindow = window.open(pdfUrl, '_blank'); // Open the blob URL in a new tab/window
      if (!pdfWindow) {
          alert('Please allow popups for this website'); // Alert if the popup is blocked
      }
      
      this.isPdfPreviewVisible = true; // Show the PDF preview if needed
      console.log('PDF Preview generated.'); // Debug log
  }

  // Download PDF function
  async downloadPDF() {
    if (!this.selectedBill) {
        alert('Please select a bill first.');
        return;
    }

    const doc = await this.createPDFDocument();
    doc.save(`${this.selectedBill.name}_Bill.pdf`);
  }

}
