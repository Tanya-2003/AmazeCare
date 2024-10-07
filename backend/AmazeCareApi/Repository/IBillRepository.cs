using System.Collections.Generic;
using System.Threading.Tasks;
using AmazeCareClass.Models;

namespace AmazeCareClass.Repositories
{
    public interface IBillRepository
    {
        Task<Bill> GetBillByIdAsync(int billId);
        Task<IEnumerable<Bill>> GetBillsByPatientIdAsync(int patientId);
        Task<IEnumerable<Bill>> GetBillsByDoctorIdAsync(int doctorId);
        Task<IEnumerable<Bill>> GetBillsByAppointmentIdAsync(int appointmentId);
        //Task<Bill> GenerateBillAsync(int patientId, int doctorId, int appointmentId);

        //03-10
        Task<IEnumerable<Bill>> GetAllBillsAsync(); 

    }
}
