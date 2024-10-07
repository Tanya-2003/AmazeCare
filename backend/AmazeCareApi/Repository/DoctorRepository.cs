using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AmazeCareClass.Data;
using AmazeCareClass.Models;
using AmazeCareApi.Repository;
using AmazeCareClass.DTO;

namespace AmazeCareApi.Repositories
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly AppDbContext _context;

        public DoctorRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Doctor> GetDoctorByIdAsync(int id)
        {
            return await _context.Doctors
                .Where(d => d.DoctorId == id)
                .FirstOrDefaultAsync();
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

        public async Task<IEnumerable<Appointment>> GetAppointmentsByDoctorIdAsync(int doctorId)
        {
            return await _context.Appointments
                .Where(a => a.DoctorId == doctorId)
                .ToListAsync();
        }

        public async Task<Appointment> UpdateAppointmentStatusAsync(int appointmentId, string status)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment != null)
            {
                appointment.Status = status;
                _context.Entry(appointment).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            return appointment;
        }

        public async Task PrescribeMedicationsAsync(int medicalRecordId, string medicineName, string medicineFrequency, string medicineTime)
        {
            var medicalRecord = await _context.MedicalRecords.FindAsync(medicalRecordId);
            if (medicalRecord != null)
            {
                // Prescribe medication logic here
                // e.g., medicalRecord.Prescriptions.Add(new Prescription { ... });
                _context.Entry(medicalRecord).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
        }

        //public async Task UpdateMedicalRecordAsync(MedicalRecord medicalRecord)
        //{
        //    _context.Entry(medicalRecord).State = EntityState.Modified;
        //    await _context.SaveChangesAsync();
        //}
        public async Task UpdateMedicalRecordAsync(MedicalRecord medicalRecord)
        {
            // Attach the medical record to track changes, without loading related entities
            _context.Entry(medicalRecord).State = EntityState.Modified;

            // Only mark specific properties as modified
            _context.Entry(medicalRecord).Property(mr => mr.MedicineName).IsModified = true;
            _context.Entry(medicalRecord).Property(mr => mr.MedicineFrequency).IsModified = true;
            _context.Entry(medicalRecord).Property(mr => mr.MedicineTime).IsModified = true;
            _context.Entry(medicalRecord).Property(mr => mr.Diagnosis).IsModified = true;
            _context.Entry(medicalRecord).Property(mr => mr.TreatmentPlan).IsModified = true;
            _context.Entry(medicalRecord).Property(mr => mr.InsuranceCoverage).IsModified = true;

            // Mark the foreign key IDs as modified (but not the entire related entities)
            _context.Entry(medicalRecord).Property(mr => mr.PatientId).IsModified = true;
            _context.Entry(medicalRecord).Property(mr => mr.DoctorId).IsModified = true;
            _context.Entry(medicalRecord).Property(mr => mr.AppointmentId).IsModified = true;

            await _context.SaveChangesAsync();
        }

        public async Task<MedicalRecord> GetMedicalRecordByIdAsync(int id)
        {
            return await _context.MedicalRecords.FindAsync(id);
        }
        public async Task UpdateAsync(MedicalRecord medicalRecord)
        {
            _context.Entry(medicalRecord).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Appointment>> GetPastAppointmentsAsync(int doctorId)
        {
            // Get today's date
            var today = DateOnly.FromDateTime(DateTime.Now);

            // Fetch all appointments and filter in-memory
            var appointments = await _context.Appointments
                .Where(a => a.DoctorId == doctorId)
                .ToListAsync();

            return appointments
                .Where(a => new DateOnly(a.AppointmentDate.Year, a.AppointmentDate.Month, a.AppointmentDate.Day) < today);
        }

        public async Task<Doctor> AuthenticateDoctorAsync(string username, string password)
        {
            return await _context.Doctors
                .FirstOrDefaultAsync(d => d.Username == username && d.Password == password);
        }
    }
}
