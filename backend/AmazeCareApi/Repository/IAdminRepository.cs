using AmazeCareClass.DTO;
using AmazeCareClass.Models;

public interface IAdminRepository
{
    // Doctor CRUD Operations
    Task<Doctor> GetDoctorByIdAsync(int id);
    Task<IEnumerable<Doctor>> GetAllDoctorsAsync();
    Task<Doctor> AddDoctorAsync(Doctor doctor);
    Task<Doctor> UpdateDoctorAsync(Doctor doctor);
    Task DeleteDoctorAsync(int id);

    // Patient CRUD Operations
    Task<Patient> GetPatientByIdAsync(int patientId);
    Task<IEnumerable<Patient>> GetAllPatientsAsync();
    Task AddPatientAsync(Patient patient);
    Task UpdatePatientAsync(Patient patient);
    Task DeletePatientAsync(int patientId);

    // Appointment Management
    Task<IEnumerable<Appointment>> GetAllAppointmentsAsync();
    Task<Appointment> GetAppointmentByIdAsync(int appointmentId);
    Task<IEnumerable<Appointment>> GetAppointmentsByPatientIdAsync(int patientId);
    Task<IEnumerable<Appointment>> GetAppointmentsByDoctorIdAsync(int doctorId);
    Task AddAppointmentAsync(Appointment appointment);
    Task UpdateAppointmentAsync(Appointment appointment);
    Task DeleteAppointmentAsync(int appointmentId);

    // Medical Record Update
    Task<IEnumerable<MedicalRecord>> GetAllMedicalRecordsAsync();
    Task<MedicalRecord> GetMedicalRecordByIdAsync(int recordId);
    Task<IEnumerable<MedicalRecord>> GetMedicalRecordsByPatientIdAsync(int patientId);
    Task<IEnumerable<MedicalRecord>> GetMedicalRecordsByDoctorIdAsync(int doctorId);
    Task AddMedicalRecordAsync(MedicalRecord medicalRecord);
    Task UpdateMedicalRecordAsync(MedicalRecord medicalRecord);
    Task DeleteMedicalRecordAsync(int recordId);

    // Doctor Detail Management
    Task<DoctorDetail> GetDoctorDetailByIdAsync(int id);
    Task AddDoctorDetailAsync(DoctorDetail doctorDetail);
    Task UpdateDoctorDetailAsync(DoctorDetail doctorDetail);
    Task DeleteDoctorDetailAsync(int id);
    Task<IEnumerable<DoctorDetail>> GetAllDoctorDetailAsync();


    //Billing Operations
    Task<IEnumerable<Bill>> GetAllBillingAsync();

    // Authentication
    Task<bool> ValidateAdminCredentialsAsync(string username, string password);
}
