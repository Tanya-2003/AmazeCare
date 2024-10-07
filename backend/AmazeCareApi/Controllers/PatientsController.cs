using Microsoft.AspNetCore.Mvc;
using AmazeCareClass.Models;
using AmazeCareApi.Repository;
using AmazeCareClass.DTO;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
//using AmazeCareApi.Service;
using log4net;
using AmazeCareApi.Exceptions;
using AmazeCareClass.Data;
using Microsoft.EntityFrameworkCore;

namespace AmazeCareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientRepository _patientRepository;
        private readonly AppDbContext _context;
        private static readonly ILog log = LogManager.GetLogger(typeof(PatientsController));

        public PatientsController(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }

        [HttpGet("doctors")]
        public async Task<ActionResult<IEnumerable<DoctorRegisterDTO>>> GetDoctors()
        {
            var doctors = await _context.Doctors.ToListAsync();

            var doctorDtos = doctors.Select(d => new DoctorRegisterDTO
            {
                FirstName = d.FirstName,
                LastName = d.LastName,
                DateOfBirth = d.DateOfBirth, // Assuming DateOfBirth is a DateOnly in the database
                Gender = d.Gender,
                PhoneNumber = d.PhoneNumber,
                SecondaryPhoneNumber = d.SecondaryPhoneNumber,
                Email = d.Email,
                Specialisation = d.Specialisation,
                LicenseNumber = d.LicenseNumber,
                Username = d.Username,
                YearsOfExperience = d.YearsOfExperience,
                // Construct the image path by matching the doctor's name
                //ImagePath = $"assets/images/doctors/{d.FirstName}_{d.LastName}.jpg" // Modify as per your naming convention
            });

            return Ok(doctorDtos);
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] PatientRegisterDTO patientDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newPatient = new Patient
            {
                FirstName = patientDto.FirstName,
                LastName = patientDto.LastName,
                DateOfBirth = patientDto.DateOfBirth,
                Gender = patientDto.Gender,
                Email = patientDto.Email,
                Address = patientDto.Address,
                BloodGroup = patientDto.BloodGroup,
                KnownAllergies = patientDto.KnownAllergies,
                CurrentMedication = patientDto.CurrentMedication,
                Username = patientDto.Username,
                Password = patientDto.Password,
            };

            await _patientRepository.AddAsync(newPatient);
            return CreatedAtAction(nameof(GetPatient), new { id = newPatient.PatientId }, newPatient);
        }

        [HttpPut("UpdateProfile/{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] PatientRegisterDTO patientRegisterDTO)
        {
            if (!ModelState.IsValid || id <= 0)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingPatient = await _patientRepository.GetPatientByIdAsync(id);
                if (existingPatient == null)
                {
                    throw new PatientNotFoundException();
                }

                // Update patient fields only (leaving out any navigation properties)
                existingPatient.FirstName = patientRegisterDTO.FirstName;
                existingPatient.LastName = patientRegisterDTO.LastName;
                existingPatient.DateOfBirth = patientRegisterDTO.DateOfBirth;
                existingPatient.Gender = patientRegisterDTO.Gender;
                existingPatient.Email = patientRegisterDTO.Email;
                existingPatient.Address = patientRegisterDTO.Address;
                existingPatient.BloodGroup = patientRegisterDTO.BloodGroup;
                existingPatient.KnownAllergies = patientRegisterDTO.KnownAllergies;
                existingPatient.CurrentMedication = patientRegisterDTO.CurrentMedication;

                await _patientRepository.UpdateAsync(existingPatient);
                return NoContent();
            }
            catch (PatientNotFoundException)
            {
                return NotFound(new { message = "Patient not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the patient profile.", error = ex.Message });
            }
        }

        [HttpGet("Profile/{id}")]
        public async Task<ActionResult<Patient>> ViewProfile(int id)
        {
            log.Info("GET Profile byId method called");
            try
            {
                var patient = await _patientRepository.GetPatientByIdAsync(id);
                if (patient == null)
                {
                    throw new PatientNotFoundException();
                }

                return Ok(patient);
            }
            catch (PatientNotFoundException)
            {
                return NotFound(new { message = "Patient not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the patient profile.", error = ex.Message });
            }
        }

        [HttpGet("Appointments/{id}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> ViewAppointments(int id)
        {
            try
            {
                var appointments = await _patientRepository.GetAppointmentsByPatientIdAsync(id);
                if (appointments == null || !appointments.Any())
                {
                    throw new PatientNotFoundException(); // Adjust as needed for appointments
                }

                return Ok(appointments);
            }
            catch (PatientNotFoundException)
            {
                return NotFound(new { message = "No appointments found for this patient." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving appointments.", error = ex.Message });
            }
        }

        [HttpDelete("CancelAppointment/{appointmentId}")]
        public async Task<IActionResult> CancelAppointment(int appointmentId)
        {
            try
            {
                var result = await _patientRepository.CancelAppointmentAsync(appointmentId);
                if (!result)
                {
                    throw new InvalidAppointmentException();
                }

                return NoContent();
            }
            catch (InvalidAppointmentException)
            {
                return NotFound(new { message = "Appointment not found or cannot be canceled." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while canceling the appointment.", error = ex.Message });
            }
        }

        [HttpGet("MedicalRecords/{id}")]
        public async Task<ActionResult<IEnumerable<MedicalRecord>>> ViewMedicalRecords(int id)
        {
            try
            {
                var medicalRecords = await _patientRepository.GetMedicalRecordsByPatientIdAsync(id);
                if (medicalRecords == null || !medicalRecords.Any())
                {
                    throw new PatientNotFoundException(); // Adjust as needed for medical records
                }

                return Ok(medicalRecords);
            }
            catch (PatientNotFoundException)
            {
                return NotFound(new { message = "No medical records found for this patient." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving medical records.", error = ex.Message });
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] PatientLoginDTO patientLoginDTO)
        {
            try
            {
                var patient = await _patientRepository.AuthenticatePatientAsync(patientLoginDTO.Username, patientLoginDTO.Password);
                if (patient == null)
                {
                    throw new AuthenticationException();
                }

                var token = GenerateJwtToken(patient);
                return Ok(new { Token = token });
            }
            catch (AuthenticationException)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during authentication.", error = ex.Message });
            }
        }

        // Utility method for JWT token generation
        private string GenerateJwtToken(Patient patient)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, patient.PatientId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Hexaware@2024Hexaware@2024Hexaware@2024Hexaware@2024Hexaware@2024Hexaware@2024Hexaware@2024Hexaware@2024"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "yourdomain.com",
                audience: "yourdomain.com",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            try
            {
                var patient = await _patientRepository.GetPatientByIdAsync(id);
                if (patient == null)
                {
                    throw new PatientNotFoundException();
                }

                return Ok(patient);
            }
            catch (PatientNotFoundException)
            {
                return NotFound(new { message = "Patient not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the patient.", error = ex.Message });
            }
        }
    }
}
