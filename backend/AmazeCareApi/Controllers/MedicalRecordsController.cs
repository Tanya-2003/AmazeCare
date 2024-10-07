using AmazeCareApi.Repositories;
using AmazeCareClass.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using AmazeCareApi.Exceptions;

namespace AmazeCareApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalRecordsController : ControllerBase
    {
        private readonly IMedicalRecordRepository _medicalRecordRepository;

        public MedicalRecordsController(IMedicalRecordRepository medicalRecordRepository)
        {
            _medicalRecordRepository = medicalRecordRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicalRecord>>> GetMedicalRecords()
        {
            try
            {
                var records = await _medicalRecordRepository.GetAllRecordsAsync();
                return Ok(records);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving records.", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalRecord>> GetMedicalRecordById(int id)
        {
            try
            {
                var record = await _medicalRecordRepository.GetRecordByIdAsync(id);
                if (record == null)
                {
                    throw new PatientNotFoundException();
                }
                return Ok(record);
            }
            catch (PatientNotFoundException)
            {
                return NotFound(new { message = "Medical record not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the record.", error = ex.Message });
            }
        }

        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<MedicalRecord>>> GetMedicalRecordsByDoctorId(int doctorId)
        {
            try
            {
                var records = await _medicalRecordRepository.GetRecordsByDoctorIdAsync(doctorId);
                if (records == null || !records.Any())
                {
                    throw new DoctorNotFoundException();
                }
                return Ok(records);
            }
            catch (DoctorNotFoundException)
            {
                return NotFound(new { message = "No medical records found for this doctor." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving records by doctor ID.", error = ex.Message });
            }
        }

        [HttpGet("patient/{patientId}")]
        public async Task<ActionResult<IEnumerable<MedicalRecord>>> GetMedicalRecordsByPatientId(int patientId)
        {
            try
            {
                var records = await _medicalRecordRepository.GetRecordsByPatientIdAsync(patientId);
                if (records == null || !records.Any())
                {
                    throw new PatientNotFoundException();
                }
                return Ok(records);
            }
            catch (PatientNotFoundException)
            {
                return NotFound(new { message = "No medical records found for this patient." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving records by patient ID.", error = ex.Message });
            }
        }

        [HttpGet("appointment/{appointmentId}")]
        public async Task<ActionResult<IEnumerable<MedicalRecord>>> GetMedicalRecordsByAppointmentId(int appointmentId)
        {
            try
            {
                var records = await _medicalRecordRepository.GetRecordsByAppointmentIdAsync(appointmentId);
                if (records == null || !records.Any())
                {
                    throw new InvalidAppointmentException();
                }
                return Ok(records);
            }
            catch (InvalidAppointmentException)
            {
                return NotFound(new { message = "No medical records found for this appointment." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving records by appointment ID.", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddMedicalRecord(MedicalRecord medicalRecord)
        {
            try
            {
                await _medicalRecordRepository.AddMedicalRecordAsync(medicalRecord);
                return CreatedAtAction(nameof(GetMedicalRecordById), new { id = medicalRecord.RecordId }, medicalRecord);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding the medical record.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicalRecord(int id, MedicalRecord medicalRecord)
        {
            if (id != medicalRecord.RecordId)
            {
                return BadRequest(new { message = "Record ID in the URL does not match the Record ID in the body" });
            }

            try
            {
                await _medicalRecordRepository.UpdateMedicalRecordAsync(medicalRecord);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the record.", error = ex.Message });
            }
        }

        [HttpPut("patient/{patientId}")]
        public async Task<IActionResult> UpdateMedicalRecordByPatientId(int patientId, MedicalRecord medicalRecord)
        {
            try
            {
                await _medicalRecordRepository.UpdateMedicalRecordByPatientIdAsync(patientId, medicalRecord);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the record by patient ID.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicalRecord(int id)
        {
            try
            {
                await _medicalRecordRepository.DeleteMedicalRecordAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the record.", error = ex.Message });
            }
        }
    }
}
