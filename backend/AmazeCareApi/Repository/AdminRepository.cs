using AmazeCareClass.Data;
using AmazeCareClass.Models;
using Microsoft.EntityFrameworkCore;
using AmazeCareClass.DTO;

public class AdminRepository : IAdminRepository
{
    private readonly AppDbContext _context;

    public AdminRepository(AppDbContext context)
    {
        _context = context;
    }

    #region Doctor
    // Doctor CRUD Operations
    public async Task<Doctor> GetDoctorByIdAsync(int id)
    {
        return await _context.Doctors
            .Include(d => d.Appointments)
            .Include(d => d.Bills)
            .Include(d => d.MedicalRecords)
            .FirstOrDefaultAsync(d => d.DoctorId == id);
    }

    public async Task<IEnumerable<Doctor>> GetAllDoctorsAsync()
    {
        return await _context.Doctors.ToListAsync();
    }

    public async Task<Doctor> AddDoctorAsync(Doctor doctor)
    {
        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync();
        return doctor;
    }

    public async Task<Doctor> UpdateDoctorAsync(Doctor doctor)
    {
        _context.Entry(doctor).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return doctor;
    }

    public async Task DeleteDoctorAsync(int id)
    {
        var doctor = await _context.Doctors.FindAsync(id);
        if (doctor != null)
        {
            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
        }
    }
    #endregion

    #region Patient
    // Patient CRUD Operations
    public async Task<Patient> GetPatientByIdAsync(int patientId) =>
        await _context.Patients.FindAsync(patientId);

    public async Task<IEnumerable<Patient>> GetAllPatientsAsync() =>
        await _context.Patients.ToListAsync();

    public async Task AddPatientAsync(Patient patient)
    {
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
    }

    public async Task UpdatePatientAsync(Patient patient)
    {
        _context.Patients.Update(patient);
        await _context.SaveChangesAsync();
    }

    public async Task DeletePatientAsync(int patientId)
    {
        var patient = await GetPatientByIdAsync(patientId);
        if (patient != null)
        {
            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
        }
    }
    #endregion

    #region Appointment
    // Appointment Management

    public async Task<IEnumerable<Appointment>> GetAllAppointmentsAsync()
    {
        return await _context.Appointments.ToListAsync();
    }

    public async Task<Appointment> GetAppointmentByIdAsync(int appointmentId) =>
        await _context.Appointments.FindAsync(appointmentId);

    public async Task<IEnumerable<Appointment>> GetAppointmentsByPatientIdAsync(int patientId) =>
        await _context.Appointments.Where(a => a.PatientId == patientId).ToListAsync();

    public async Task<IEnumerable<Appointment>> GetAppointmentsByDoctorIdAsync(int doctorId) =>
        await _context.Appointments.Where(a => a.DoctorId == doctorId).ToListAsync();

    public async Task AddAppointmentAsync(Appointment appointment)
    {
        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAppointmentAsync(Appointment appointment)
    {
        _context.Appointments.Update(appointment);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAppointmentAsync(int appointmentId)
    {
        var appointment = await GetAppointmentByIdAsync(appointmentId);
        if (appointment != null)
        {
            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
        }
    }
    #endregion

    #region Medical Record
    // Medical Record Update
    public async Task<IEnumerable<MedicalRecord>> GetAllMedicalRecordsAsync()
    {
        return await _context.MedicalRecords.ToListAsync();
    }
    public async Task<MedicalRecord> GetMedicalRecordByIdAsync(int recordId) =>
        await _context.MedicalRecords.FindAsync(recordId);

    public async Task<IEnumerable<MedicalRecord>> GetMedicalRecordsByPatientIdAsync(int patientId) =>
        await _context.MedicalRecords.Where(r => r.PatientId == patientId).ToListAsync();

    public async Task<IEnumerable<MedicalRecord>> GetMedicalRecordsByDoctorIdAsync(int doctorId) =>
        await _context.MedicalRecords.Where(r => r.DoctorId == doctorId).ToListAsync();

    public async Task AddMedicalRecordAsync(MedicalRecord medicalRecord)
    {
        _context.MedicalRecords.Add(medicalRecord);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateMedicalRecordAsync(MedicalRecord medicalRecord)
    {
        _context.MedicalRecords.Update(medicalRecord);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteMedicalRecordAsync(int recordId)
    {
        var medicalRecord = await GetMedicalRecordByIdAsync(recordId);
        if (medicalRecord != null)
        {
            _context.MedicalRecords.Remove(medicalRecord);
            await _context.SaveChangesAsync();
        }
    }
    #endregion

    #region DoctorDetail
    // Doctor Detail Management
    public async Task<IEnumerable<DoctorDetail>> GetAllDoctorDetailAsync()
    {
        return await _context.DoctorDetails.ToListAsync();
    }
    public async Task<DoctorDetail> GetDoctorDetailByIdAsync(int id) =>
        await _context.DoctorDetails.FindAsync(id);

    public async Task AddDoctorDetailAsync(DoctorDetail doctorDetail)
    {
        _context.DoctorDetails.Add(doctorDetail);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateDoctorDetailAsync(DoctorDetail doctorDetail)
    {
        _context.DoctorDetails.Update(doctorDetail);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteDoctorDetailAsync(int id)
    {
        var doctorDetail = await GetDoctorDetailByIdAsync(id);
        if (doctorDetail != null)
        {
            _context.DoctorDetails.Remove(doctorDetail);
            await _context.SaveChangesAsync();
        }
    }
    #endregion

    //Billing
    public async Task<IEnumerable<Bill>> GetAllBillingAsync()
    {
        return await _context.Bills.ToListAsync();
    }

    // Authentication
    public async Task<bool> ValidateAdminCredentialsAsync(string username, string password)
    {
        // Implement your authentication logic here
        // This is just a placeholder
        return await Task.FromResult(true);
    }
}
