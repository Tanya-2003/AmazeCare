using AmazeCareClass.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AmazeCareClass.Repositories
{
    public interface IAppointmentRepository
    {
        Task<IEnumerable<Appointment>> GetAppointmentsAsync();
        Task<Appointment> GetAppointmentByIdAsync(int id);
        Task<IEnumerable<Appointment>> GetAppointmentsByDoctorIdAsync(int doctorId);
        Task<IEnumerable<Appointment>> GetAppointmentsByPatientIdAsync(int patientId);
        Task UpdateAppointmentAsync(Appointment appointment);
        Task DeleteAppointmentAsync(int id);
        Task<bool> AppointmentExistsAsync(int id);
        Task<bool> ValidatePatientAndDoctorIdsAsync(int patientId, int doctorId);

        #region Appointment Methods
        Task<List<Appointment>> GetDoctorAppointmentsAsync(int doctorId, DateTime appointmentDate);
        Task<List<Appointment>> GetUpcomingAppointmentsForPatientAsync(int patientId);
        Task<List<Appointment>> GetPreviousAppointmentsForPatientAsync(int patientId);
        Task<List<Appointment>> GetUpcomingAppointmentsForDoctorAsync(int doctorId);
        Task<List<Appointment>> GetPreviousAppointmentsForDoctorAsync(int doctorId);
        Task<string> BookAppointment(Appointment newAppointment);
        Task<List<DateTime>> GetAvailableTimes(int doctorId, DateTime appointmentDate);
        //Task AddAppointmentAsync(Appointment appointment);
        Task AddAppointmentAsync(Appointment appointment);
        Task<bool> CheckDoctorAvailabilityAsync(int doctorId, DateTime appointmentDate); // Ensure this method is also defined without async
        #endregion
    }
}
