using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AmazeCareApi.Repository;
using AmazeCareClass.Data;
using AmazeCareClass.DTO;
using AmazeCareClass.Models;
using Microsoft.EntityFrameworkCore;

namespace AmazeCareApi.Repositories
{
    public class PatientRepository : IPatientRepository
    {
        private readonly AppDbContext _context;

        public PatientRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Patient> GetPatientByIdAsync(int id)
        {
            return await _context.Patients.FindAsync(id);
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByPatientIdAsync(int patientId)
        {
            return await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .ToListAsync();
        }

        public async Task<IEnumerable<MedicalRecord>> GetMedicalRecordsByPatientIdAsync(int patientId)
        {
            return await _context.MedicalRecords
                .Where(m => m.PatientId == patientId)
                .ToListAsync();
        }

        public async Task AddAsync(Patient patient)
        {
            await _context.Patients.AddAsync(patient);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Patient patient)
        {
            _context.Entry(patient).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<bool> CancelAppointmentAsync(int appointmentId)
        {
            var appointment = await _context.Appointments.FindAsync(appointmentId);
            if (appointment == null) return false;

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return true;
        }

        //public async Task<PatientLoginDTO> AuthenticatePatientAsync(string username, string password)
        //{
        //    var patient = await _context.Patients
        //        .FirstOrDefaultAsync(p => p.Username == username && p.Password == password);

        //    if (patient == null)
        //        return null;

        //    // Map Patient to PatientLoginDTO
        //    return new PatientLoginDTO
        //    {
        //        Username = patient.Username,
        //        Password = patient.Password
        //        // If needed, include other properties
        //    };
        //}
        //public async Task<Patient> AuthenticatePatientAsync(string username, string password)
        //{
        //    return await _context.Patients
        //        .FirstOrDefaultAsync(p => p.Username == username && p.Password == password);
        //}
        public async Task<Patient> AuthenticatePatientAsync(string username, string password)
        {
            // Replace with your actual authentication logic
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.Username == username && p.Password == password);
            return patient;
        }
    }
}
