using AmazeCareApi.Exceptions;
using AmazeCareClass.DTO;
using AmazeCareClass.Repositories;
using AmazeCareClass.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AmazeCareApi.Service;
using Microsoft.EntityFrameworkCore;
using AmazeCareClass.Data;

namespace AmazeCareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentRepository _appointmentRepository;

        private readonly AppDbContext _context;

        public AppointmentsController(IAppointmentRepository appointmentRepository, AppDbContext context)
        {
            _appointmentRepository = appointmentRepository;
            _context = context; // Initialize the context
        }

        #region New Methods for Book and get Appointment Functions

        // GET: api/Appointments/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetPatientAppointments(int patientId)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByPatientIdAsync(patientId);
            if (appointments == null || !appointments.Any())
            {
                return NotFound("No appointments found for this patient.");
            }
            return Ok(appointments);
        }

        // GET: api/Appointments/doctor/{doctorId}
        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetDoctorAppointments(int doctorId)
        {
            var appointments = await _appointmentRepository.GetAppointmentsByDoctorIdAsync(doctorId);
            if (appointments == null || !appointments.Any())
            {
                return NotFound("No appointments found for this doctor.");
            }
            return Ok(appointments);
        }

        // POST: api/Appointments
        //[HttpPost]
        //public async Task<IActionResult> CreateAppointment([FromBody] Appointment dto)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    // Validate doctor's availability
        //    var isAvailable = await _appointmentRepository.AddAppointmentAsync(dto);
        //    if (!isAvailable)
        //    {
        //        return BadRequest("Cannot book appointment: Doctor is not available at this time.");
        //    }

        //    // Create new appointment
        //    var appointment = new Appointment
        //    {
        //        PatientId = dto.PatientId,
        //        DoctorId = dto.DoctorId,
        //        AppointmentDate = dto.AppointmentDate,
        //        Status = dto.Status,
        //        Remarks = dto.Remarks
        //    };

        //    await _appointmentRepository.AddAppointmentAsync(appointment);
        //    return CreatedAtAction(nameof(CreateAppointment), new { id = appointment.AppointmentId }, appointment);
        //}

        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] Appointment dto)
        {
            try
            {
                // Create new appointment
                var appointment = new Appointment
                {
                    PatientId = dto.PatientId,
                    DoctorId = dto.DoctorId,
                    AppointmentDate = dto.AppointmentDate,
                    Status = dto.Status,
                    Remarks = dto.Remarks
                };

                await _appointmentRepository.AddAppointmentAsync(appointment); // Call the modified repository method

                return CreatedAtAction(nameof(CreateAppointment), new { id = appointment.AppointmentId }, appointment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message); // Return bad request with the exception message
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while creating the appointment."); // General error handling
            }
        }

        [HttpGet("available-times")]
        public async Task<IActionResult> GetAvailableTimes(int doctorId, DateTime appointmentDate)
        {
            var availableTimes = await _appointmentRepository.GetAvailableTimes(doctorId, appointmentDate);
            if (availableTimes == null || !availableTimes.Any())
            {
                return NotFound("No available times found for the selected date.");
            }
            return Ok(availableTimes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDTO>> GetAppointment(int id)
        {
            try
            {
                var appointment = await _appointmentRepository.GetAppointmentByIdAsync(id);

                if (appointment == null)
                {
                    throw new InvalidAppointmentException();
                }

                var appointmentDto = new AppointmentDTO
                {
                    AppointmentId = appointment.AppointmentId,
                    PatientId = appointment.PatientId,
                    DoctorId = appointment.DoctorId,
                    AppointmentDate = appointment.AppointmentDate,
                    Status = appointment.Status,
                    Remarks = appointment.Remarks
                };

                return Ok(appointmentDto);
            }
            catch (InvalidAppointmentException)
            {
                return NotFound(new { message = "Appointment not found or invalid." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetAppointments()
        {
            try
            {
                var appointments = await _appointmentRepository.GetAppointmentsAsync();
                var appointmentDTOs = appointments.Select(a => new AppointmentDTO
                {
                    AppointmentId = a.AppointmentId,
                    PatientId = a.PatientId,
                    DoctorId = a.DoctorId,
                    AppointmentDate = a.AppointmentDate,
                    Status = a.Status,
                    Remarks = a.Remarks
                }).ToList();

                return Ok(appointmentDTOs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] AppointmentDTO appointmentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Validate Patient and Doctor IDs
                var validIds = await _appointmentRepository.ValidatePatientAndDoctorIdsAsync(appointmentDto.PatientId, appointmentDto.DoctorId);
                if (!validIds)
                {
                    throw new InvalidAppointmentException("Invalid PatientId or DoctorId.");
                }

                var appointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
                if (appointment == null)
                {
                    throw new InvalidAppointmentException();
                }

                // Update appointment details
                appointment.PatientId = appointmentDto.PatientId;
                appointment.DoctorId = appointmentDto.DoctorId;
                appointment.AppointmentDate = appointmentDto.AppointmentDate;
                appointment.Status = appointmentDto.Status;
                appointment.Remarks = appointmentDto.Remarks;

                await _appointmentRepository.UpdateAppointmentAsync(appointment);

                return NoContent();
            }
            catch (InvalidAppointmentException)
            {
                return NotFound(new { message = "Appointment not found or invalid." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            try
            {
                var appointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
                if (appointment == null)
                {
                    throw new InvalidAppointmentException();
                }

                await _appointmentRepository.DeleteAppointmentAsync(id);
                return NoContent();
            }
            catch (InvalidAppointmentException)
            {
                return NotFound(new { message = "Appointment not found or invalid." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        //[HttpGet("available-times")]
        //public async Task<IActionResult> GetAvailableTimes(int doctorId, DateTime appointmentDate)
        //{
        //    var availableTimes = await _appointmentRepository.GetAvailableTimes(doctorId, appointmentDate);
        //    return Ok(availableTimes);
        //}

        //[HttpGet("upcoming/patient/{patientId}")]
        //public async Task<IActionResult> GetUpcomingAppointmentsForPatient(int patientId)
        //{
        //    var appointments = await _context.Appointments
        //        .Where(a => a.PatientId == patientId && a.AppointmentDate > DateTime.Now)
        //        .ToListAsync();
        //    return Ok(appointments);
        //}
        [HttpGet("upcoming/patient/{patientId}")]
        public async Task<IActionResult> GetUpcomingAppointmentsForPatient(int patientId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.PatientId == patientId && a.AppointmentDate > DateTime.Now)
                .ToListAsync();
            if (appointments == null || !appointments.Any())
            {
                return NotFound("No upcoming appointments found for this patient.");
            }
            return Ok(appointments);
        }
        [HttpGet("previous/patient/{patientId}")]
        public async Task<IActionResult> GetPreviousAppointmentsForPatient(int patientId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.PatientId == patientId && a.AppointmentDate <= DateTime.Now)
                .ToListAsync();
            return Ok(appointments);
        }

        [HttpGet("upcoming/doctor/{doctorId}")]
        public async Task<IActionResult> GetUpcomingAppointmentsForDoctor(int doctorId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.DoctorId == doctorId && a.AppointmentDate > DateTime.Now)
                .ToListAsync();
            return Ok(appointments);
        }

        [HttpGet("previous/doctor/{doctorId}")]
        public async Task<IActionResult> GetPreviousAppointmentsForDoctor(int doctorId)
        {
            var appointments = await _context.Appointments
                .Where(a => a.DoctorId == doctorId && a.AppointmentDate <= DateTime.Now)
                .ToListAsync();
            return Ok(appointments);
        }
        #endregion

        #region Existing Appointment Methods
        //// GET: api/Appointments
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetAppointments()
        //{
        //    try
        //    {
        //        var appointments = await _appointmentRepository.GetAppointmentsAsync();
        //        var appointmentDTOs = appointments.Select(a => new AppointmentDTO
        //        {
        //            AppointmentId = a.AppointmentId,
        //            PatientId = a.PatientId,
        //            DoctorId = a.DoctorId,
        //            AppointmentDate = a.AppointmentDate,
        //            Status = a.Status,
        //            Remarks = a.Remarks,
        //            //AppointmentTime = a.AppointmentTime
        //        }).ToList();

        //        return Ok(appointmentDTOs);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = ex.Message });
        //    }
        //}

        //// GET: api/Appointments/Doctor/5
        //[HttpGet("Doctor/{doctorId}")]
        //public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetAppointmentsByDoctorId(int doctorId)
        //{
        //    try
        //    {
        //        var appointments = await _appointmentRepository.GetAppointmentsByDoctorIdAsync(doctorId);

        //        if (appointments == null || !appointments.Any())
        //        {
        //            throw new DoctorNotFoundException();
        //        }

        //        var appointmentDTOs = appointments.Select(a => new AppointmentDTO
        //        {
        //            AppointmentId = a.AppointmentId,
        //            PatientId = a.PatientId,
        //            DoctorId = a.DoctorId,
        //            AppointmentDate = a.AppointmentDate,
        //            Status = a.Status,
        //            Remarks = a.Remarks,
        //            //AppointmentTime = a.AppointmentTime
        //        }).ToList();

        //        return Ok(appointmentDTOs);
        //    }
        //    catch (DoctorNotFoundException)
        //    {
        //        return NotFound(new { message = "Doctor not found." });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = ex.Message });
        //    }
        //}

        //// GET: api/Appointments/Patient/5
        //[HttpGet("Patient/{patientId}")]
        //public async Task<ActionResult<IEnumerable<AppointmentDTO>>> GetAppointmentsByPatientId(int patientId)
        //{
        //    try
        //    {
        //        var appointments = await _appointmentRepository.GetAppointmentsByPatientIdAsync(patientId);

        //        if (appointments == null || !appointments.Any())
        //        {
        //            throw new PatientNotFoundException();
        //        }

        //        var appointmentDTOs = appointments.Select(a => new AppointmentDTO
        //        {
        //            AppointmentId = a.AppointmentId,
        //            PatientId = a.PatientId,
        //            DoctorId = a.DoctorId,
        //            AppointmentDate = a.AppointmentDate,
        //            Status = a.Status,
        //            Remarks = a.Remarks,
        //            //AppointmentTime = a.AppointmentTime
        //        }).ToList();

        //        return Ok(appointmentDTOs);
        //    }
        //    catch (PatientNotFoundException)
        //    {
        //        return NotFound(new { message = "Patient not found." });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = ex.Message });
        //    }
        //}

        //// GET: api/Appointments/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<AppointmentDTO>> GetAppointment(int id)
        //{
        //    try
        //    {
        //        var appointment = await _appointmentRepository.GetAppointmentByIdAsync(id);

        //        if (appointment == null)
        //        {
        //            throw new InvalidAppointmentException();
        //        }

        //        var appointmentDto = new AppointmentDTO
        //        {
        //            AppointmentId = appointment.AppointmentId,
        //            PatientId = appointment.PatientId,
        //            DoctorId = appointment.DoctorId,
        //            AppointmentDate = appointment.AppointmentDate,
        //            Status = appointment.Status,
        //            Remarks = appointment.Remarks,
        //            //AppointmentTime = appointment.AppointmentTime
        //        };

        //        return Ok(appointmentDto);
        //    }
        //    catch (InvalidAppointmentException)
        //    {
        //        return NotFound(new { message = "Appointment not found or invalid." });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = ex.Message });
        //    }
        //}

        //// POST: api/Appointments
        //[HttpPost]
        //public async Task<IActionResult> BookAppointment([FromBody] AppointmentDTO appointmentDto)
        //{
        //    try
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return BadRequest(ModelState);
        //        }

        //        var validIds = await _appointmentRepository.ValidatePatientAndDoctorIdsAsync(appointmentDto.PatientId, appointmentDto.DoctorId);
        //        if (!validIds)
        //        {
        //            throw new InvalidAppointmentException("Invalid PatientId or DoctorId.");
        //        }

        //        var appointment = new Appointment
        //        {
        //            PatientId = appointmentDto.PatientId,
        //            DoctorId = appointmentDto.DoctorId,
        //            AppointmentDate = appointmentDto.AppointmentDate,
        //            Status = appointmentDto.Status,
        //            Remarks = appointmentDto.Remarks,
        //            //AppointmentTime = appointmentDto.AppointmentTime
        //        };

        //        await _appointmentRepository.AddAppointmentAsync(appointment);
        //        appointmentDto.AppointmentId = appointment.AppointmentId;

        //        return CreatedAtAction(nameof(GetAppointment), new { id = appointment.AppointmentId }, appointmentDto);
        //    }
        //    catch (InvalidAppointmentException ex)
        //    {
        //        return BadRequest(new { message = ex.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = ex.Message });
        //    }
        //}

        //// PUT: api/Appointments/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> UpdateAppointment(int id, [FromBody] AppointmentDTO appointmentDto)
        //{
        //    try
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return BadRequest(ModelState);
        //        }

        //        var validIds = await _appointmentRepository.ValidatePatientAndDoctorIdsAsync(appointmentDto.PatientId, appointmentDto.DoctorId);
        //        if (!validIds)
        //        {
        //            throw new InvalidAppointmentException("Invalid PatientId or DoctorId.");
        //        }

        //        var appointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
        //        if (appointment == null)
        //        {
        //            throw new InvalidAppointmentException();
        //        }

        //        appointment.PatientId = appointmentDto.PatientId;
        //        appointment.DoctorId = appointmentDto.DoctorId;
        //        appointment.AppointmentDate = appointmentDto.AppointmentDate;
        //        appointment.Status = appointmentDto.Status;
        //        appointment.Remarks = appointmentDto.Remarks;
        //       // appointment.AppointmentTime = appointmentDto.AppointmentTime;

        //        await _appointmentRepository.UpdateAppointmentAsync(appointment);

        //        return NoContent();
        //    }
        //    catch (InvalidAppointmentException ex)
        //    {
        //        return NotFound(new { message = ex.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = ex.Message });
        //    }
        //}

        //// DELETE: api/Appointments/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteAppointment(int id)
        //{
        //    try
        //    {
        //        var appointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
        //        if (appointment == null)
        //        {
        //            throw new InvalidAppointmentException();
        //        }

        //        await _appointmentRepository.DeleteAppointmentAsync(id);
        //        return NoContent();
        //    }
        //    catch (InvalidAppointmentException)
        //    {
        //        return NotFound(new { message = "Appointment not found or invalid." });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = ex.Message });
        //    }
        //}

        //// PUT: api/Appointments/Cancel/5
        //[HttpPut("Cancel/{id}")]
        //public async Task<IActionResult> CancelAppointment(int id)
        //{
        //    try
        //    {
        //        var appointment = await _appointmentRepository.GetAppointmentByIdAsync(id);
        //        if (appointment == null)
        //        {
        //            throw new InvalidAppointmentException();
        //        }

        //        appointment.Status = "Cancelled"; // Assume "Cancelled" is a valid status
        //        await _appointmentRepository.UpdateAppointmentAsync(appointment);

        //        return NoContent();
        //    }
        //    catch (InvalidAppointmentException)
        //    {
        //        return NotFound(new { message = "Appointment not found or invalid." });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = ex.Message });
        //    }
        //} 
        #endregion
    }
}