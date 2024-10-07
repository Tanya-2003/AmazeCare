using AmazeCareApi.Repositories;
using AmazeCareClass.Data;
using AmazeCareClass.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AmazeCareApi.Repositories
{
    public class MedicalRecordRepository : IMedicalRecordRepository
    {
        private readonly AppDbContext _context;

        public MedicalRecordRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MedicalRecord>> GetAllRecordsAsync()
        {
            return await _context.MedicalRecords.ToListAsync();
        }

        public async Task<MedicalRecord> GetRecordByIdAsync(int recordId)
        {
            return await _context.MedicalRecords.FirstOrDefaultAsync(m => m.RecordId == recordId);
        }

        public async Task<IEnumerable<MedicalRecord>> GetRecordsByDoctorIdAsync(int doctorId)
        {
            return await _context.MedicalRecords.Where(m => m.DoctorId == doctorId).ToListAsync();
        }

        public async Task<IEnumerable<MedicalRecord>> GetRecordsByPatientIdAsync(int patientId)
        {
            return await _context.MedicalRecords.Where(m => m.PatientId == patientId).ToListAsync();
        }

        public async Task<IEnumerable<MedicalRecord>> GetRecordsByAppointmentIdAsync(int appointmentId)
        {
            return await _context.MedicalRecords.Where(m => m.AppointmentId == appointmentId).ToListAsync();
        }

        public async Task AddMedicalRecordAsync(MedicalRecord medicalRecord)
        {
            _context.MedicalRecords.Add(medicalRecord);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateMedicalRecordAsync(MedicalRecord medicalRecord)
        {
            _context.Entry(medicalRecord).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateMedicalRecordByPatientIdAsync(int patientId, MedicalRecord medicalRecord)
        {
            var existingRecords = await _context.MedicalRecords.Where(m => m.PatientId == patientId).ToListAsync();
            if (existingRecords != null)
            {
                foreach (var record in existingRecords)
                {
                    record.Diagnosis = medicalRecord.Diagnosis;
                    record.MedicineName = medicalRecord.MedicineName;
                    record.MedicineFrequency = medicalRecord.MedicineFrequency;
                    record.MedicineTime = medicalRecord.MedicineTime;
                    record.TreatmentPlan = medicalRecord.TreatmentPlan;
                    record.NextAppointmentDate = medicalRecord.NextAppointmentDate;
                    record.InsuranceCoverage = medicalRecord.InsuranceCoverage;
                }
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteMedicalRecordAsync(int recordId)
        {
            var medicalRecord = await _context.MedicalRecords.FindAsync(recordId);
            if (medicalRecord != null)
            {
                _context.MedicalRecords.Remove(medicalRecord);
                await _context.SaveChangesAsync();
            }
        }
    }
}
