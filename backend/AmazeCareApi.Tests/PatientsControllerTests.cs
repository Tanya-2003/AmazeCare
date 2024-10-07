using AmazeCareApi.Controllers;
using AmazeCareApi.Repository;
using AmazeCareClass.DTO;
using AmazeCareClass.Models;
using Moq;
using NUnit.Framework;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AmazeCareApi.Tests
{
    [TestFixture]
    public class PatientsControllerTests
    {
        private PatientsController _controller;
        private Mock<IPatientRepository> _patientRepositoryMock;

        [SetUp]
        public void Setup()
        {
            _patientRepositoryMock = new Mock<IPatientRepository>();

            _controller = new PatientsController(_patientRepositoryMock.Object);
        }

        [Test]
        public async Task Register_ValidPatient_ReturnsCreatedAtAction()
        {
            // Arrange
            var patientDto = new PatientRegisterDTO
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                DateOfBirth = new DateTime(1990, 1, 1), // Using DateOnly type for DateOfBirth
                Gender = "Male",
                Address = "123 Street",
                BloodGroup = "O+",
                KnownAllergies = "None",
                CurrentMedication = "None"
            };

            // Act
            var result = await _controller.Register(patientDto);

            // Assert
            Assert.IsInstanceOf<CreatedAtActionResult>(result);
        }

        [Test]
        public async Task ViewProfile_PatientExists_ReturnsOkWithPatient()
        {
            // Arrange
            var patient = new Patient { PatientId = 1, FirstName = "John", LastName = "Doe" };
            _patientRepositoryMock.Setup(repo => repo.GetPatientByIdAsync(1)).ReturnsAsync(patient);

            // Act
            var result = await _controller.ViewProfile(1);

            // Assert
            Assert.IsInstanceOf<ActionResult<Patient>>(result);

            var okResult = result.Result as OkObjectResult; // Accessing the Result property of ActionResult<Patient>
            Assert.IsNotNull(okResult);  // Ensuring it's not null
            Assert.AreEqual(patient, okResult.Value);
        }

        [Test]
        public async Task ViewProfile_PatientNotFound_ReturnsNotFound()
        {
            // Arrange
            _patientRepositoryMock.Setup(repo => repo.GetPatientByIdAsync(1)).ReturnsAsync((Patient)null);

            // Act
            var result = await _controller.ViewProfile(1);

            // Assert
            Assert.IsInstanceOf<ActionResult<Patient>>(result); // Assert the correct return type
            var notFoundResult = result.Result as NotFoundResult; // Access the Result property of ActionResult
            Assert.IsNotNull(notFoundResult); // Ensure it is NotFound
        }

        [Test]
        public async Task UpdateProfile_ValidPatient_ReturnsNoContent()
        {
            // Arrange
            var patientRegisterDto = new PatientRegisterDTO
            {
                FirstName = "Updated Name",
                LastName = "Doe",
                Email = "updated@example.com"
            };
            var existingPatient = new Patient { PatientId = 1, FirstName = "John", LastName = "Doe" };

            _patientRepositoryMock.Setup(repo => repo.GetPatientByIdAsync(1)).ReturnsAsync(existingPatient);
            _patientRepositoryMock.Setup(repo => repo.UpdateAsync(existingPatient)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.UpdateProfile(1, patientRegisterDto);

            // Assert
            Assert.IsInstanceOf<NoContentResult>(result);
        }

        [Test]
        public async Task UpdateProfile_PatientNotFound_ReturnsNotFound()
        {
            // Arrange
            var patientRegisterDto = new PatientRegisterDTO { FirstName = "Updated Name" };

            _patientRepositoryMock.Setup(repo => repo.GetPatientByIdAsync(1)).ReturnsAsync((Patient)null);

            // Act
            var result = await _controller.UpdateProfile(1, patientRegisterDto);

            // Assert
            Assert.IsInstanceOf<NotFoundResult>(result);
        }

        [Test]
        public async Task ViewAppointments_PatientExists_ReturnsOkWithAppointments()
        {
            // Arrange
            var appointments = new List<Appointment>
    {
        new Appointment { AppointmentId = 1, PatientId = 1, DoctorId = 1 }
    };
            _patientRepositoryMock.Setup(repo => repo.GetAppointmentsByPatientIdAsync(1)).ReturnsAsync(appointments);

            // Act
            var result = await _controller.ViewAppointments(1);

            // Assert
            Assert.IsInstanceOf<ActionResult<IEnumerable<Appointment>>>(result);

            var okResult = result.Result as OkObjectResult;  // Accessing the Result property of ActionResult
            Assert.IsNotNull(okResult); // Ensure it's not null
            Assert.AreEqual(appointments, okResult.Value);
        }

        [Test]
        public async Task CancelAppointment_AppointmentExists_ReturnsNoContent()
        {
            // Arrange
            _patientRepositoryMock.Setup(repo => repo.CancelAppointmentAsync(1)).ReturnsAsync(true);

            // Act
            var result = await _controller.CancelAppointment(1);

            // Assert
            Assert.IsInstanceOf<NoContentResult>(result);
        }

        [Test]
        public async Task CancelAppointment_AppointmentNotFound_ReturnsNotFound()
        {
            // Arrange
            _patientRepositoryMock.Setup(repo => repo.CancelAppointmentAsync(1)).ReturnsAsync(false);

            // Act
            var result = await _controller.CancelAppointment(1);

            // Assert
            Assert.IsInstanceOf<NotFoundResult>(result);
        }

        [Test]
        public async Task ViewMedicalRecords_PatientExists_ReturnsOkWithMedicalRecords()
        {
            // Arrange
            var medicalRecords = new List<MedicalRecord>
    {
        new MedicalRecord { RecordId = 1, PatientId = 1, DoctorId = 1 }
    };
            _patientRepositoryMock.Setup(repo => repo.GetMedicalRecordsByPatientIdAsync(1)).ReturnsAsync(medicalRecords);

            // Act
            var result = await _controller.ViewMedicalRecords(1);

            // Assert
            Assert.IsInstanceOf<ActionResult<IEnumerable<MedicalRecord>>>(result); // Checking for the correct return type
            var okResult = result.Result as OkObjectResult;  // Accessing the Result property of ActionResult
            Assert.IsNotNull(okResult); // Ensure the OkObjectResult is not null
            Assert.AreEqual(medicalRecords, okResult.Value);
        }

    }
}
