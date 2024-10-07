using AmazeCareClass.Data;
using AmazeCareClass.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AmazeCareClass.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly AppDbContext _context;

        public AppointmentRepository(AppDbContext context)
        {
            _context = context;
        }

        #region Appointment Methods

        public async Task<string> BookAppointment(Appointment newAppointment)
        {
            // Check if the doctor is available
            var doctorAppointments = await GetDoctorAppointmentsAsync(newAppointment.DoctorId, newAppointment.AppointmentDate);

            if (doctorAppointments.Any())
            {
                return "Doctor not available at the selected time.";
            }

            await AddAppointmentAsync(newAppointment);
            return "Appointment booked successfully!";
        }

        public async Task<List<DateTime>> GetAvailableTimes(int doctorId, DateTime appointmentDate)
        {
            var existingAppointments = await GetDoctorAppointmentsAsync(doctorId, appointmentDate);
            List<DateTime> availableTimes = new List<DateTime>();

            for (int i = 9; i <= 17; i++) // 9 AM to 5 PM working hours
            {
                DateTime potentialTime = appointmentDate.Date.AddHours(i);
                if (!existingAppointments.Any(a => a.AppointmentDate == potentialTime))
                {
                    availableTimes.Add(potentialTime);
                }
            }

            return availableTimes;
        }

        //public async Task<bool> CheckDoctorAvailabilityAsync(int doctorId, DateTime appointmentDate)
        //{
        //    // Check if the doctor has any appointments at the specified date and time
        //    var isAvailable = await _context.Appointments
        //        .AnyAsync(a => a.DoctorId == doctorId && a.AppointmentDate == appointmentDate);

        //    // Return true if no appointments are found, meaning the doctor is available
        //    return !isAvailable;
        //}
        public async Task<bool> CheckDoctorAvailabilityAsync(int doctorId, DateTime appointmentDate)
        {
            var existingAppointments = await _context.Appointments
                .Where(a => a.DoctorId == doctorId &&
                             a.AppointmentDate.Date == appointmentDate.Date)
                .ToListAsync();

            return !existingAppointments.Any(a => a.AppointmentDate.TimeOfDay == appointmentDate.TimeOfDay);
        }

        public async Task<List<Appointment>> GetUpcomingAppointmentsForPatientAsync(int patientId)
        {
            return await _context.Appointments
                .Where(a => a.PatientId == patientId && a.AppointmentDate > DateTime.Now)
                .ToListAsync();
        }

        public async Task<List<Appointment>> GetPreviousAppointmentsForPatientAsync(int patientId)
        {
            return await _context.Appointments
                .Where(a => a.PatientId == patientId && a.AppointmentDate <= DateTime.Now)
                .ToListAsync();
        }

        public async Task<List<Appointment>> GetUpcomingAppointmentsForDoctorAsync(int doctorId)
        {
            return await _context.Appointments
                .Where(a => a.DoctorId == doctorId && a.AppointmentDate > DateTime.Now)
                .ToListAsync();
        }

        public async Task<List<Appointment>> GetPreviousAppointmentsForDoctorAsync(int doctorId)
        {
            return await _context.Appointments
                .Where(a => a.DoctorId == doctorId && a.AppointmentDate <= DateTime.Now)
                .ToListAsync();
        }

        //public async Task<bool> AddAppointmentAsync(Appointment appointment)
        //{
        //    var existingAppointments = await _context.Appointments
        //        .Where(a => a.DoctorId == appointment.DoctorId &&
        //                     a.AppointmentDate.Date == appointment.AppointmentDate.Date)
        //        .ToListAsync();

        //    if (existingAppointments.Any(a => a.AppointmentDate.TimeOfDay == appointment.AppointmentDate.TimeOfDay))
        //    {
        //        return false; // Doctor not available
        //    }

        //    _context.Appointments.Add(appointment);
        //    await _context.SaveChangesAsync();
        //    return true; // Appointment successfully added
        //}
        public async Task AddAppointmentAsync(Appointment appointment)
        {
            try
            {
                // Check for existing appointments for the same doctor on the same date
                var existingAppointments = await _context.Appointments
                    .Where(a => a.DoctorId == appointment.DoctorId &&
                                 a.AppointmentDate.Date == appointment.AppointmentDate.Date)
                    .ToListAsync();

                // Validate availability: check if any existing appointment matches the requested time
                if (existingAppointments.Any(a => a.AppointmentDate.TimeOfDay == appointment.AppointmentDate.TimeOfDay))
                {
                    throw new InvalidOperationException("Doctor not available at the requested time.");
                }

                // Add the new appointment
                await _context.Appointments.AddAsync(appointment);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                // Log detailed information about the exception
                Console.WriteLine("Error saving changes: " + ex.Message);
                Console.WriteLine("Inner Exception: " + ex.InnerException?.Message);
                Console.WriteLine("Stack Trace: " + ex.StackTrace);

                throw; // Rethrow the exception for further handling
            }
            catch (Exception ex)
            {
                // Catch any other exceptions
                Console.WriteLine("An error occurred: " + ex.Message);
                Console.WriteLine("Stack Trace: " + ex.StackTrace);

                throw; // Rethrow the exception for further handling
            }
        }


        public async Task<IEnumerable<Appointment>> GetAppointmentsAsync()
        {
            return await _context.Appointments.ToListAsync();
        }

        public async Task<Appointment> GetAppointmentByIdAsync(int id)
        {
            return await _context.Appointments.FindAsync(id);
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByDoctorIdAsync(int doctorId)
        {
            return await _context.Appointments
                .Where(a => a.DoctorId == doctorId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByPatientIdAsync(int patientId)
        {
            return await _context.Appointments
                .Where(a => a.PatientId == patientId)
                .ToListAsync();
        }

        public async Task UpdateAppointmentAsync(Appointment appointment)
        {
            _context.Entry(appointment).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAppointmentAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment != null)
            {
                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> AppointmentExistsAsync(int id)
        {
            return await _context.Appointments.AnyAsync(a => a.AppointmentId == id);
        }

        public async Task<bool> ValidatePatientAndDoctorIdsAsync(int patientId, int doctorId)
        {
            var patientExists = await _context.Patients.AnyAsync(p => p.PatientId == patientId);
            var doctorExists = await _context.Doctors.AnyAsync(d => d.DoctorId == doctorId);
            return patientExists && doctorExists;
        }

        public async Task<List<Appointment>> GetDoctorAppointmentsAsync(int doctorId, DateTime appointmentDate)
        {
            return await _context.Appointments
                .Where(a => a.DoctorId == doctorId && a.AppointmentDate == appointmentDate)
                .ToListAsync();
        }

        #endregion
    }
}
