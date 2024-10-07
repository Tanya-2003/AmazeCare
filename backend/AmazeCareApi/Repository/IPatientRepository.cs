using System.Collections.Generic;
using System.Threading.Tasks;
using AmazeCareClass.DTO;
using AmazeCareClass.Models;
using Microsoft.AspNetCore.Mvc;

namespace AmazeCareApi.Repository
{
    public interface IPatientRepository
    {
        Task<Patient> GetPatientByIdAsync(int id);
        Task<IEnumerable<Appointment>> GetAppointmentsByPatientIdAsync(int patientId);
        Task<IEnumerable<MedicalRecord>> GetMedicalRecordsByPatientIdAsync(int patientId);
        //Task<Patient> CreatePatientAsync(Patient patient);
        Task AddAsync(Patient patient);
        Task UpdateAsync(Patient patient);
        //Task<bool> UpdatePatientAsync(int id, Patient patient);
        Task<bool> CancelAppointmentAsync(int appointmentId);
        Task<Patient> AuthenticatePatientAsync(string username, string password);

        //Task<PatientLoginDTO> AuthenticatePatientAsync(string username, string password);
    }
}
