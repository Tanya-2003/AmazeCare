using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using AmazeCareClass.Models;
using AmazeCareApi.Repository;
using AmazeCareApi.Exceptions;
using AmazeCareClass.Repositories;

namespace AmazeCareClass.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillController : ControllerBase
    {
        private readonly IBillRepository _billRepository;

        public BillController(IBillRepository billRepository)
        {
            _billRepository = billRepository;
        }

        [HttpGet("{billId}")]
        public async Task<ActionResult<Bill>> GetBillById(int billId)
        {
            var bill = await _billRepository.GetBillByIdAsync(billId);
            if (bill == null)
            {
                return NotFound(new { message = "Bill not found." });
            }
            return Ok(bill);
        }

        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<Bill>>> GetBillsByPatientId(int patientId)
        {
            try
            {
                var bills = await _billRepository.GetBillsByPatientIdAsync(patientId);
                if (bills == null || !bills.Any())
                {
                    throw new PatientNotFoundException("Patient not found.");
                }
                return Ok(bills);
            }
            catch (PatientNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<Bill>>> GetBillsByDoctorId(int doctorId)
        {
            try
            {
                var bills = await _billRepository.GetBillsByDoctorIdAsync(doctorId);
                if (bills == null || !bills.Any())
                {
                    throw new DoctorNotFoundException("Doctor not found.");
                }
                return Ok(bills);
            }
            catch (DoctorNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("appointment/{appointmentId}")]
        public async Task<ActionResult<IEnumerable<Bill>>> GetBillsByAppointmentId(int appointmentId)
        {
            try
            {
                var bills = await _billRepository.GetBillsByAppointmentIdAsync(appointmentId);
                if (bills == null || !bills.Any())
                {
                    throw new InvalidAppointmentException("Invalid appointment ID.");
                }
                return Ok(bills);
            }
            catch (InvalidAppointmentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("all")] // Endpoint to get all bills
        public async Task<ActionResult<IEnumerable<Bill>>> GetAllBills()
        {
            var bills = await _billRepository.GetAllBillsAsync();
            return Ok(bills); 
        }

    }
}
//[HttpPost("generate")]
//public async Task<ActionResult<Bill>> GenerateBill([FromBody] GenerateBillRequest request)
//{
//    try
//    {
//        var bill = await _billRepository.GenerateBillAsync(request.PatientId, request.DoctorId, request.AppointmentId);
//        return CreatedAtAction(nameof(GetBillById), new { billId = bill.BillId }, bill);
//    }
//    catch (Exception ex)
//    {
//        return BadRequest(ex.Message);
//    }
//}

//public class GenerateBillRequest
//{
//    public int PatientId { get; set; }
//    public int DoctorId { get; set; }
//    public int AppointmentId { get; set; }
//}