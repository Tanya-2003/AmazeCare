using System.Collections.Generic;
using System.Threading.Tasks;
using AmazeCareClass.DTO;
using AmazeCareClass.Models;

namespace AmazeCareApi.Repository
{
    public interface IDoctorRepository
    {
        Task<Doctor> GetDoctorByIdAsync(int id);
        Task<IEnumerable<Doctor>> GetAllDoctorsAsync();
        Task<Doctor> AddDoctorAsync(Doctor doctor);
        Task<Doctor> UpdateDoctorAsync(Doctor doctor);
        Task DeleteDoctorAsync(int id);
        Task<IEnumerable<Appointment>> GetAppointmentsByDoctorIdAsync(int doctorId);
        Task<Appointment> UpdateAppointmentStatusAsync(int appointmentId, string status);
        Task PrescribeMedicationsAsync(int medicalRecordId, string medicineName, string medicineFrequency, string medicineTime);
        Task UpdateMedicalRecordAsync(MedicalRecord medicalRecord);
        Task<IEnumerable<Appointment>> GetPastAppointmentsAsync(int doctorId);
        Task<Doctor> AuthenticateDoctorAsync(string username, string password);

        Task<MedicalRecord> GetMedicalRecordByIdAsync(int id);
        Task UpdateAsync(MedicalRecord medicalRecord);

    }
}
