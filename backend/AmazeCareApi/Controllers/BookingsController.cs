using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazeCareClass.Data;
using AmazeCareClass.Models;
using AmazeCareClass.DTO;

namespace AmazeCareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            return await _context.Bookings.ToListAsync();
        }

        // GET: api/Bookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
        }

        // PUT: api/Bookings/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutBooking(int id, Booking booking)
        //{
        //    if (id != booking.Id)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(booking).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!BookingExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        // POST: api/Bookings
        //[HttpPost]
        //public async Task<ActionResult<Booking>> PostBooking(Booking booking)
        //{
        //    _context.Bookings.Add(booking);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetBooking", new { id = booking.Id }, booking);
        //}

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingDTO bookingDto)
        {
            // Create a new Booking entry based on the DTO
            var booking = new Booking
            {
                Name = bookingDto.Name,
                Email = bookingDto.Email,
                PhoneNumber = bookingDto.PhoneNumber,
                PreferredDate = bookingDto.PreferredDate,
                PreferredTime = bookingDto.PreferredTime,
                Symptoms = bookingDto.Symptoms,
                DoctorName = bookingDto.DoctorName
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            // Retrieve the PatientId using the email
            var patientId = await GetPatientIdAsync(bookingDto.Email);

            // Split the DoctorName into FirstName and LastName
            var nameParts = bookingDto.DoctorName.Split(' ');
            if (nameParts.Length < 2)
            {
                return BadRequest("Invalid Doctor name format. Please provide both first and last name.");
            }
            var firstName = nameParts[0];
            var lastName = nameParts[1];

            // Retrieve the DoctorId using FirstName and LastName
            var doctorId = await GetDoctorIdAsync(firstName, lastName);

            // Check if the DoctorId was retrieved successfully
            if (doctorId == null)
            {
                return BadRequest($"Doctor with name '{bookingDto.DoctorName}' does not exist.");
            }

            // Create a new Appointment entry
            var appointment = new Appointment
            {
                PatientId = patientId,
                DoctorId = doctorId.Value, // Use the valid DoctorId
                AppointmentDate = booking.PreferredDate + booking.PreferredTime,
                Status = "Pending",
                Remarks = booking.Symptoms
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok("Booking and Appointment created successfully");
        }

        // Helper Method to Retrieve the PatientId using Email
        private async Task<int> GetPatientIdAsync(string email)
        {
            // Find the patient by email (assumption: patient is guaranteed to exist)
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Email == email);

            if (patient == null)
            {
                throw new Exception($"Patient with email '{email}' not found.");
            }

            return patient.PatientId;  // Return the existing PatientId
        }

        // Updated Helper Method to Retrieve DoctorId using FirstName and LastName
        private async Task<int?> GetDoctorIdAsync(string firstName, string lastName)
        {
            // Find the doctor by FirstName and LastName
            var doctor = await _context.Doctors
                                       .FirstOrDefaultAsync(d => d.FirstName == firstName && d.LastName == lastName);

            return doctor?.DoctorId;  // Return DoctorId if found, or null otherwise
        }

        //public async Task<IActionResult> CreateBooking([FromBody] BookingDTO bookingDto)
        //{
        //    var booking = new Booking
        //    {
        //        Name = bookingDto.Name,
        //        Email = bookingDto.Email,
        //        PhoneNumber = bookingDto.PhoneNumber,
        //        PreferredDate = bookingDto.PreferredDate,
        //        PreferredTime = bookingDto.PreferredTime,
        //        Symptoms = bookingDto.Symptoms,
        //        DoctorName = bookingDto.DoctorName
        //    };

        //    _context.Bookings.Add(booking);
        //    await _context.SaveChangesAsync();

        //    var appointment = new Appointment
        //    {
        //        PatientId = GetPatientId(bookingDto.Email),
        //        DoctorId = GetDoctorId(bookingDto.DoctorName),
        //        AppointmentDate = booking.PreferredDate + booking.PreferredTime,
        //        Status = "Pending",
        //        Remarks = booking.Symptoms
        //    };

        //    _context.Appointments.Add(appointment);
        //    await _context.SaveChangesAsync();

        //    return Ok("Booking and Appointment created successfully");
        //}

        private int GetPatientId(string email)
        {
            var patient = _context.Patients.FirstOrDefault(p => p.Email == email);
            return patient?.PatientId ?? 0;
        }

        private int GetDoctorId(string doctorName)
        {
            var doctor = _context.Doctors.FirstOrDefault(d => (d.FirstName + d.LastName) == doctorName);
            return doctor?.DoctorId ?? 0;
        }
    }

    // DELETE: api/Bookings/5
    //    [HttpDelete("{id}")]
    //    public async Task<IActionResult> DeleteBooking(int id)
    //    {
    //        var booking = await _context.Bookings.FindAsync(id);
    //        if (booking == null)
    //        {
    //            return NotFound();
    //        }

    //        _context.Bookings.Remove(booking);
    //        await _context.SaveChangesAsync();

    //        return NoContent();
    //    }

    //private bool BookingExists(int id)
    //{
    //    return _context.Bookings.Any(e => e.Id == id);
    //}
}

