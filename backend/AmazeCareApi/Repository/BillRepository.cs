using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AmazeCareClass.Models;
using AmazeCareClass.Data;

namespace AmazeCareClass.Repositories
{
    public class BillRepository : IBillRepository
    {
        private readonly AppDbContext _context;

        public BillRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Bill> GetBillByIdAsync(int billId)
        {
            return await _context.Bills
                .Where(b => b.BillId == billId)
                .SingleOrDefaultAsync();
        }

        public async Task<IEnumerable<Bill>> GetBillsByPatientIdAsync(int patientId)
        {
            return await _context.Bills
                .Where(b => b.PatientId == patientId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Bill>> GetBillsByDoctorIdAsync(int doctorId)
        {
            return await _context.Bills
                .Where(b => b.DoctorId == doctorId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Bill>> GetBillsByAppointmentIdAsync(int appointmentId)
        {
            return await _context.Bills
                .Where(b => b.AppointmentId == appointmentId)
                .ToListAsync();
        }

        //public async Task<Bill> GenerateBillAsync(int patientId, int doctorId, int appointmentId)
        //{
        //    // Fetch doctor detail to get the consultation fee
        //    var doctorDetail = await _context.DoctorDetails
        //        .Where(dd => dd.DoctorId == doctorId)
        //        .SingleOrDefaultAsync();

        //    if (doctorDetail == null)
        //    {
        //        throw new Exception("Doctor not found");
        //    }

        //    // Create a new bill
        //    var bill = new Bill
        //    {
        //        PatientId = patientId,
        //        DoctorId = doctorId,
        //        AppointmentId = appointmentId,
        //        ConsultationFee = doctorDetail.ConsultationFee, // Retrieve the fee from DoctorDetail
        //        Total = doctorDetail.ConsultationFee // Assuming total is just the consultation fee for now
        //    };

        //    // Add the bill to the database
        //    _context.Bills.Add(bill);
        //    await _context.SaveChangesAsync();

        //    return bill;
        //}
        public async Task<IEnumerable<Bill>> GetAllBillsAsync() // Implementation of the new method
        {
            return await _context.Bills.ToListAsync();
        }
    }
}
