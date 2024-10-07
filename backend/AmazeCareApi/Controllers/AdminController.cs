using AmazeCareClass.Models;
using Microsoft.AspNetCore.Mvc;
using AmazeCareClass.DTO;
using System.Threading.Tasks;
using AmazeCareApi.Exceptions;
using System.ComponentModel.DataAnnotations;
using AmazeCareApi.Controllers;
using log4net;
using Microsoft.AspNetCore.Authorization;

//[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminRepository _adminRepository;
    private static readonly ILog log = LogManager.GetLogger(typeof(AdminController));

    public AdminController(IAdminRepository adminRepository)
    {
        _adminRepository = adminRepository;
    }

    #region Doctors
    // Doctor CRUD Operations

    // Get all doctors
    [HttpGet("doctors")]
    public async Task<IActionResult> GetAllDoctors()
    {
        try
        {
            log.Info("GET all doctors used");
            var doctors = await _adminRepository.GetAllDoctorsAsync();
            return Ok(doctors);
        }
        catch (Exception ex)
        {
            log.Error("Error fetching doctors", ex);
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet("doctor/{doctorId}")]
    public async Task<IActionResult> GetDoctor(int doctorId)
    {
        try
        {
            log.Info("GET Doctor by Id used");
            var doctor = await _adminRepository.GetDoctorByIdAsync(doctorId);
            if (doctor == null) throw new DoctorNotFoundException();
            return Ok(doctor);
        }
        catch (DoctorNotFoundException)
        {
            log.Info("GET Doctor by Id declined due to doctor not found");
            return NotFound(new { message = "Doctor not found." });
        }
    }

    [HttpPost("doctor")]
    public async Task<IActionResult> AddDoctor([FromBody] DoctorRegisterDTO doctorDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            log.Info("POST Doctor used");

            var doctor = new Doctor
            {
                //DoctorId = doctorDto.DoctorId,
                FirstName = doctorDto.FirstName,
                LastName = doctorDto.LastName,
                DateOfBirth = doctorDto.DateOfBirth,
                Gender = doctorDto.Gender,
                PhoneNumber = doctorDto.PhoneNumber,
                SecondaryPhoneNumber = doctorDto.SecondaryPhoneNumber,
                Email = doctorDto.Email,
                Specialisation = doctorDto.Specialisation,
                LicenseNumber = doctorDto.LicenseNumber,
                Username = doctorDto.Username,
                Password = doctorDto.Password,
                YearsOfExperience = doctorDto.YearsOfExperience,
                //ImagePath = doctorDto.ImagePath // Add image path here
            };

            await _adminRepository.AddDoctorAsync(doctor);
            return CreatedAtAction(nameof(GetDoctor), new { doctorId = doctor.DoctorId }, doctor);
        }
        catch (Exception ex)
        {
            log.Info("POST Doctor could not be done");
            return StatusCode(500, new { message = ex.Message });
        }
    }


    [HttpPut("doctor/{doctorId}")]
    public async Task<IActionResult> UpdateDoctor(int doctorId, [FromBody] DoctorRegisterDTO doctorDto)
    {
        try
        {
            log.Info("Put Doctor by Id used");

            // Fetch the existing doctor from the database
            var existingDoctor = await _adminRepository.GetDoctorByIdAsync(doctorId);
            if (existingDoctor == null) throw new DoctorNotFoundException();

            // Update the fields from the DoctorRegisterDTO
            existingDoctor.FirstName = doctorDto.FirstName;
            existingDoctor.LastName = doctorDto.LastName;
            existingDoctor.DateOfBirth = doctorDto.DateOfBirth;
            existingDoctor.Gender = doctorDto.Gender;
            existingDoctor.PhoneNumber = doctorDto.PhoneNumber;
            existingDoctor.SecondaryPhoneNumber = doctorDto.SecondaryPhoneNumber;
            existingDoctor.Email = doctorDto.Email;
            existingDoctor.Specialisation = doctorDto.Specialisation;
            existingDoctor.LicenseNumber = doctorDto.LicenseNumber;
            existingDoctor.Username = doctorDto.Username;
            existingDoctor.Password = doctorDto.Password; // Ensure password is hashed if needed
            existingDoctor.YearsOfExperience = doctorDto.YearsOfExperience;

            // Save changes to the repository
            await _adminRepository.UpdateDoctorAsync(existingDoctor);
            return NoContent();
        }
        catch (DoctorNotFoundException)
        {
            log.Info("Couldn't update the Doctor");

            return NotFound(new { message = "Doctor not found." });
        }
    }

    [HttpDelete("doctor/{doctorId}")]
    public async Task<IActionResult> DeleteDoctor(int doctorId)
    {
        try
        {
            log.Info("Delete Doctor by Id used");

            await _adminRepository.DeleteDoctorAsync(doctorId);
            return NoContent();
        }
        catch (DoctorNotFoundException)
        {
            log.Info("Couldn't DELETE Doctor");

            return NotFound(new { message = "Doctor not found." });
        }
    }
    #endregion

    #region Patient 
    // Patient CRUD Operations

    // Get all patients
    [HttpGet("patients")]
    public async Task<IActionResult> GetAllPatients()
    {
        try
        {
            log.Info("GET all patients used");
            var patients = await _adminRepository.GetAllPatientsAsync();
            return Ok(patients);
        }
        catch (Exception ex)
        {
            log.Error("Error fetching patients", ex);
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet("patient/{patientId}")]
    public async Task<IActionResult> GetPatient(int patientId)
    {
        try
        {
            log.Info("GET Patient by Id used");

            var patient = await _adminRepository.GetPatientByIdAsync(patientId);
            if (patient == null) throw new PatientNotFoundException();
            return Ok(patient);
        }
        catch (PatientNotFoundException)
        {
            log.Info("Patient ID not found");

            return NotFound(new { message = "Patient not found." });
        }
    }

    [HttpPost("patient")]
    public async Task<IActionResult> AddPatient([FromBody] PatientRegisterDTO patientDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            log.Info("POST Patient method used");

            var patient = new Patient
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
                Password = patientDto.Password
            };

            await _adminRepository.AddPatientAsync(patient);
            return CreatedAtAction(nameof(GetPatient), new { patientId = patient.PatientId }, patient);
        }
        catch (Exception ex)
        {
            log.Info("Couldnt POST Patient");

            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPut("patient/{patientId}")]
    public async Task<IActionResult> UpdatePatient(int patientId, [FromBody] PatientRegisterDTO patientDto)
    {
        try
        {
            log.Info("PUT Doctor by Id used");

            // Fetch the existing patient from the database
            var existingPatient = await _adminRepository.GetPatientByIdAsync(patientId);
            if (existingPatient == null) throw new PatientNotFoundException();

            // Update the fields from the PatientRegisterDTO
            existingPatient.FirstName = patientDto.FirstName;
            existingPatient.LastName = patientDto.LastName;
            existingPatient.DateOfBirth = patientDto.DateOfBirth;
            existingPatient.Gender = patientDto.Gender;
            existingPatient.Email = patientDto.Email;
            existingPatient.Address = patientDto.Address;
            existingPatient.BloodGroup = patientDto.BloodGroup;
            existingPatient.KnownAllergies = patientDto.KnownAllergies;
            existingPatient.CurrentMedication = patientDto.CurrentMedication;
            existingPatient.Username = patientDto.Username;
            existingPatient.Password = patientDto.Password;  // Ensure password is hashed if necessary

            // Save changes to the repository
            await _adminRepository.UpdatePatientAsync(existingPatient);
            return NoContent();
        }
        catch (PatientNotFoundException)
        {
            log.Info("Patient Not Found");

            return NotFound(new { message = "Patient not found." });
        }
    }

    [HttpDelete("patient/{patientId}")]
    public async Task<IActionResult> DeletePatient(int patientId)
    {
        try
        {
            log.Info("DELETE Patient by Id used");

            await _adminRepository.DeletePatientAsync(patientId);
            return NoContent();
        }
        catch (PatientNotFoundException)
        {
            log.Info("Patient not found");

            return NotFound(new { message = "Patient not found." });
        }
    }

    #endregion

    #region Appointments
    // Appointment Management

    // Get all medical records
    [HttpGet("medicalrecords")]
    public async Task<IActionResult> GetAllMedicalRecords()
    {
        try
        {
            log.Info("GET all medical records used");
            var records = await _adminRepository.GetAllMedicalRecordsAsync();
            return Ok(records);
        }
        catch (Exception ex)
        {
            log.Error("Error fetching medical records", ex);
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet("appointment/{appointmentId}")]
    public async Task<IActionResult> GetAppointment(int appointmentId)
    {
        try
        {
            log.Info("GET Appointment by Id used");

            var appointment = await _adminRepository.GetAppointmentByIdAsync(appointmentId);
            if (appointment == null) throw new InvalidAppointmentException();
            return Ok(appointment);
        }
        catch (InvalidAppointmentException)
        {
            log.Info("Appointment Id invalid or not found");

            return NotFound(new { message = "Appointment not found or invalid." });
        }
    }

    [HttpPost("appointment")]
    public async Task<IActionResult> AddAppointment([FromBody] Appointment appointment)
    {
        try
        {
            log.Info("GET Appointment by Id used");

            await _adminRepository.AddAppointmentAsync(appointment);
            return CreatedAtAction(nameof(GetAppointment), new { appointmentId = appointment.AppointmentId }, appointment);
        }
        catch (Exception ex)
        {
            log.Info("Appointment not found");

            // Handle other exceptions
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPut("appointment/{appointmentId}")]
    public async Task<IActionResult> UpdateAppointment(int appointmentId, [FromBody] Appointment appointment)
    {
        try
        {
            log.Info("Update Appointment initiated");

            if (appointmentId != appointment.AppointmentId) return BadRequest();
            await _adminRepository.UpdateAppointmentAsync(appointment);
            return NoContent();
        }
        catch (InvalidAppointmentException)
        {
            log.Info("Appointment not found or invalid");

            return NotFound(new { message = "Appointment not found or invalid." });
        }
    }

    [HttpDelete("appointment/{appointmentId}")]
    public async Task<IActionResult> DeleteAppointment(int appointmentId)
    {
        try
        {
            await _adminRepository.DeleteAppointmentAsync(appointmentId);
            return NoContent();
        }
        catch (InvalidAppointmentException)
        {
            return NotFound(new { message = "Appointment not found or invalid." });
        }
    }

    #endregion

    #region Medical Records

    // Medical Record Management

    // Get all appointments
    [HttpGet("appointments")]
    public async Task<IActionResult> GetAllAppointments()
    {
        try
        {
            log.Info("GET all appointments used");
            var appointments = await _adminRepository.GetAllAppointmentsAsync();
            return Ok(appointments);
        }
        catch (Exception ex)
        {
            log.Error("Error fetching appointments", ex);
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet("medicalrecord/{recordId}")]
    public async Task<IActionResult> GetMedicalRecord(int recordId)
    {
        try
        {
            var record = await _adminRepository.GetMedicalRecordByIdAsync(recordId);
            if (record == null) return NotFound(new { message = "Medical record not found." });
            return Ok(record);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPost("medicalrecord")]
    public async Task<IActionResult> AddMedicalRecord([FromBody] MedicalRecord medicalRecord)
    {
        try
        {
            await _adminRepository.AddMedicalRecordAsync(medicalRecord);
            return CreatedAtAction(nameof(GetMedicalRecord), new { recordId = medicalRecord.RecordId }, medicalRecord);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPut("medicalrecord/{recordId}")]
    public async Task<IActionResult> UpdateMedicalRecord(int recordId, [FromBody] MedicalRecord medicalRecord)
    {
        try
        {
            if (recordId != medicalRecord.RecordId) return BadRequest();
            await _adminRepository.UpdateMedicalRecordAsync(medicalRecord);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpDelete("medicalrecord/{recordId}")]
    public async Task<IActionResult> DeleteMedicalRecord(int recordId)
    {
        try
        {
            await _adminRepository.DeleteMedicalRecordAsync(recordId);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
    #endregion

    #region DoctorDetail

    // Doctor Detail Management
    [HttpGet("doctordetail/{id}")]
    public async Task<IActionResult> GetDoctorDetail(int id)
    {
        try
        {
            var doctorDetail = await _adminRepository.GetDoctorDetailByIdAsync(id);
            if (doctorDetail == null) return NotFound(new { message = "Doctor detail not found." });
            return Ok(doctorDetail);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPost("doctordetail")]
    public async Task<IActionResult> AddDoctorDetail([FromBody] DoctorDetail doctorDetail)
    {
        try
        {
            await _adminRepository.AddDoctorDetailAsync(doctorDetail);
            return CreatedAtAction(nameof(GetDoctorDetail), new { id = doctorDetail.DoctorId }, doctorDetail);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPut("doctordetail/{id}")]
    public async Task<IActionResult> UpdateDoctorDetail(int id, [FromBody] DoctorDetail doctorDetail)
    {
        try
        {
            // Validate ID
            if (id != doctorDetail.DoctorId)
                return BadRequest(new { message = "ID in the URL does not match the ID in the body." });

            // Validate required fields
            if (string.IsNullOrEmpty(doctorDetail.Specialisation) )
                //||
                //string.IsNullOrEmpty(doctorDetail.DoctorName) ||
                //string.IsNullOrEmpty(doctorDetail.Email))
            {
                return BadRequest(new { message = "Required fields are missing." });
            }

            // Additional validation if needed
            // Example: Check if email format is valid
            //if (!new EmailAddressAttribute().IsValid(doctorDetail.Email))
            //{
            //    return BadRequest(new { message = "Invalid email format." });
            //}

            // Update the DoctorDetail
            await _adminRepository.UpdateDoctorDetailAsync(doctorDetail);

            return NoContent();
        }
        catch (Exception ex)
        {
            // Log exception details if needed
            return StatusCode(500, new { message = "An error occurred while updating doctor details.", details = ex.Message });
        }
    }

    [HttpDelete("doctordetail/{id}")]
    public async Task<IActionResult> DeleteDoctorDetail(int id)
    {
        try
        {
            await _adminRepository.DeleteDoctorDetailAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllDoctorDetail()
    {
        var doctorDetails = await _adminRepository.GetAllDoctorDetailAsync();
        return Ok(doctorDetails);
    }

    #endregion

    #region Billing
    // Get all billing records
    [HttpGet("billing")]
    public async Task<IActionResult> GetAllBilling()
    {
        try
        {
            log.Info("GET all Billing records used");
            var billingRecords = await _adminRepository.GetAllBillingAsync();
            return Ok(billingRecords);
        }
        catch (Exception ex)
        {
            log.Error("Error fetching all billing records", ex);
            return StatusCode(500, new { message = ex.Message });
        }
    }
    #endregion

    // Authentication
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AdminLoginDTO loginDTO)
    {
        try
        {
            var isValid = await _adminRepository.ValidateAdminCredentialsAsync(loginDTO.Username, loginDTO.Password);
            if (!isValid) throw new AuthenticationException();
            // Implement token generation here if needed
            return Ok();
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
}
