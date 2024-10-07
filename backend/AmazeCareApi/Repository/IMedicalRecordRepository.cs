using AmazeCareClass.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AmazeCareApi.Repositories
{
    public interface IMedicalRecordRepository
    {
        Task<IEnumerable<MedicalRecord>> GetAllRecordsAsync();
        Task<MedicalRecord> GetRecordByIdAsync(int recordId);
        Task<IEnumerable<MedicalRecord>> GetRecordsByDoctorIdAsync(int doctorId);
        Task<IEnumerable<MedicalRecord>> GetRecordsByPatientIdAsync(int patientId);
        Task<IEnumerable<MedicalRecord>> GetRecordsByAppointmentIdAsync(int appointmentId);
        Task AddMedicalRecordAsync(MedicalRecord medicalRecord);
        Task UpdateMedicalRecordAsync(MedicalRecord medicalRecord);
        Task UpdateMedicalRecordByPatientIdAsync(int patientId, MedicalRecord medicalRecord);
        Task DeleteMedicalRecordAsync(int recordId);
    }
}
