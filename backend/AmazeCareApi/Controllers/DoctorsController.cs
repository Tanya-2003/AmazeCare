using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AmazeCareApi.Repositories;
using AmazeCareClass.Models;
using AmazeCareClass.DTO;
using AmazeCareApi.Repository;
using AmazeCareApi.Exceptions;
using AmazeCareClass.Data;
using NuGet.Protocol.Core.Types;

namespace AmazeCareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly AppDbContext _context;

        public DoctorsController(IDoctorRepository doctorRepository)
        {
            _doctorRepository = doctorRepository;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctorById(int id)
        {
            var doctor = await _doctorRepository.GetDoctorByIdAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }
            return Ok(doctor);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] DoctorDTO doctorDTO)
        {
            try
            {
                var doctor = await _doctorRepository.AuthenticateDoctorAsync(doctorDTO.Username, doctorDTO.Password);
                if (doctor == null)
                {
                    throw new AuthenticationException();
                }

                // Generate and return JWT token here

                return Ok(doctor);
            }
            catch (AuthenticationException)
            {
                return Unauthorized(new { message = "Invalid credentials." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("{id}/appointments")]
        public async Task<IActionResult> ViewAppointments(int id)
        {
            try
            {
                var appointments = await _doctorRepository.GetAppointmentsByDoctorIdAsync(id);
                if (appointments == null || !appointments.Any())
                {
                    throw new DoctorNotFoundException();
                }
                return Ok(appointments);
            }
            catch (DoctorNotFoundException)
            {
                return NotFound(new { message = "Doctor not found or no appointments available." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("appointments/{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] string status)
        {
            try
            {
                var appointment = await _doctorRepository.UpdateAppointmentStatusAsync(id, status);
                if (appointment == null)
                {
                    throw new InvalidAppointmentException();
                }
                return NoContent();
            }
            catch (InvalidAppointmentException)
            {
                return NotFound(new { message = "Appointment not found or invalid status." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("prescribe")]
        public async Task<IActionResult> PrescribeMedications([FromBody] PrescribeDTO prescribeDTO)
        {
            try
            {
                await _doctorRepository.PrescribeMedicationsAsync(prescribeDTO.MedicalRecordId, prescribeDTO.MedicineName, prescribeDTO.MedicineFrequency, prescribeDTO.MedicineTime);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("UpdateConsultation")]
        public async Task<IActionResult> UpdateConsultation(int id, [FromBody] MedicalRecord medicalRecord)
        {
            try
            {
                if (!ModelState.IsValid || id <= 0)
                {
                    return BadRequest(ModelState);
                }

                var existingMedicalRecord = await _doctorRepository.GetMedicalRecordByIdAsync(id);
                if (existingMedicalRecord == null)
                {
                    throw new PatientNotFoundException();
                }

                // Update only relevant properties
                existingMedicalRecord.MedicineName = medicalRecord.MedicineName;
                existingMedicalRecord.MedicineFrequency = medicalRecord.MedicineFrequency;
                existingMedicalRecord.MedicineTime = medicalRecord.MedicineTime;
                existingMedicalRecord.Diagnosis = medicalRecord.Diagnosis;
                existingMedicalRecord.TreatmentPlan = medicalRecord.TreatmentPlan;
                existingMedicalRecord.InsuranceCoverage = medicalRecord.InsuranceCoverage;

                // Ensure foreign key IDs are passed correctly
                existingMedicalRecord.PatientId = medicalRecord.PatientId;      // Foreign key ID
                existingMedicalRecord.DoctorId = medicalRecord.DoctorId;        // Foreign key ID
                existingMedicalRecord.AppointmentId = medicalRecord.AppointmentId;  // Foreign key ID

                await _doctorRepository.UpdateMedicalRecordAsync(existingMedicalRecord);

                return NoContent();
            }
            catch (PatientNotFoundException)
            {
                return NotFound(new { message = "Medical record not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("{id}/past-appointments")]
        public async Task<IActionResult> GetPastAppointments(int id)
        {
            try
            {
                var pastAppointments = await _doctorRepository.GetPastAppointmentsAsync(id);
                if (pastAppointments == null || !pastAppointments.Any())
                {
                    throw new DoctorNotFoundException();
                }
                return Ok(pastAppointments);
            }
            catch (DoctorNotFoundException)
            {
                return NotFound(new { message = "Doctor not found or no past appointments available." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] DoctorRegisterDTO updatedDoctor)
        {
            if (updatedDoctor == null)
            {
                return BadRequest("Doctor data is invalid.");
            }
            // Validate that Username and LicenseNumber are not being updated
            //if (!string.IsNullOrEmpty(updatedDoctor.Username) ||
            //    !string.IsNullOrEmpty(updatedDoctor.LicenseNumber))
            //{
            //    return BadRequest("Username and LicenseNumber cannot be updated.");
            //}

            // Find the existing doctor by ID using the repository
            var existingDoctor = await _doctorRepository.GetDoctorByIdAsync(id);
            if (existingDoctor == null)
            {
                return NotFound($"Doctor with ID {id} not found.");
            }

            // Update the doctor properties, excluding Username, Role, and LicenseNumber
            existingDoctor.FirstName = updatedDoctor.FirstName;
            existingDoctor.LastName = updatedDoctor.LastName;
            existingDoctor.DateOfBirth = updatedDoctor.DateOfBirth;
            existingDoctor.Gender = updatedDoctor.Gender;
            existingDoctor.PhoneNumber = updatedDoctor.PhoneNumber;
            existingDoctor.SecondaryPhoneNumber = updatedDoctor.SecondaryPhoneNumber;
            existingDoctor.Email = updatedDoctor.Email;
            existingDoctor.Specialisation = updatedDoctor.Specialisation;
            existingDoctor.Username = updatedDoctor.Username;
            existingDoctor.Password = updatedDoctor.Password;
            existingDoctor.LicenseNumber = updatedDoctor.LicenseNumber;
            existingDoctor.YearsOfExperience = updatedDoctor.YearsOfExperience;

            // Update the doctor in the repository
            await _doctorRepository.UpdateDoctorAsync(existingDoctor);

            return NoContent(); // Returns 204 No Content on successful update
        }

    }

    public class PrescribeDTO
    {
        public int MedicalRecordId { get; set; }
        public string MedicineName { get; set; }
        public string MedicineFrequency { get; set; }
        public string MedicineTime { get; set; }
    }
}
