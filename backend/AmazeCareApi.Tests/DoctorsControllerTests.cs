using AmazeCareApi.Controllers;
using AmazeCareApi.Repository;
using AmazeCareClass.DTO;
using AmazeCareClass.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace AmazeCareApi.Tests
{
    [TestFixture]
    public class DoctorsControllerTests
    {
        private Mock<IDoctorRepository> _doctorRepositoryMock;
        private DoctorsController _controller;

        [SetUp]
        public void Setup()
        {
            _doctorRepositoryMock = new Mock<IDoctorRepository>();
            _controller = new DoctorsController(_doctorRepositoryMock.Object);
        }

        [Test]
        public async Task Login_ValidCredentials_ReturnsOkWithDoctor()
        {
            // Arrange
            var doctorDTO = new DoctorDTO { Username = "doctor1", Password = "password" };
            var doctor = new Doctor { DoctorId = 1, Username = "doctor1" };
            _doctorRepositoryMock
                .Setup(repo => repo.AuthenticateDoctorAsync(doctorDTO.Username, doctorDTO.Password))
                .ReturnsAsync(doctor);

            // Act
            var result = await _controller.Login(doctorDTO);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(doctor, okResult.Value);
        }

        [Test]
        public async Task Login_InvalidCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var doctorDTO = new DoctorDTO { Username = "doctor1", Password = "wrongpassword" };
            _doctorRepositoryMock
                .Setup(repo => repo.AuthenticateDoctorAsync(doctorDTO.Username, doctorDTO.Password))
                .ReturnsAsync((Doctor)null);

            // Act
            var result = await _controller.Login(doctorDTO);

            // Assert
            Assert.IsInstanceOf<UnauthorizedResult>(result);
        }

        [Test]
        public async Task ViewAppointments_DoctorExists_ReturnsOkWithAppointments()
        {
            // Arrange
            var doctorId = 1;
            var appointments = new List<Appointment>
    {
        new Appointment { AppointmentId = 1, DoctorId = doctorId, PatientId = 1 }
    };
            _doctorRepositoryMock
                .Setup(repo => repo.GetAppointmentsByDoctorIdAsync(doctorId))
                .ReturnsAsync(appointments);

            // Act
            var result = await _controller.ViewAppointments(doctorId);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(appointments, okResult.Value);
        }

        [Test]
        public async Task ViewAppointments_DoctorNotExists_ReturnsEmptyList()
        {
            // Arrange
            var doctorId = 99; // Non-existent doctor
            _doctorRepositoryMock
                .Setup(repo => repo.GetAppointmentsByDoctorIdAsync(doctorId))
                .ReturnsAsync(new List<Appointment>());

            // Act
            var result = await _controller.ViewAppointments(doctorId);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.IsEmpty(okResult.Value as IEnumerable<Appointment>);
        }

        [Test]
        public async Task UpdateAppointment_ValidAppointment_ReturnsNoContent()
        {
            // Arrange
            var appointmentId = 1;
            var status = "Completed";
            var appointment = new Appointment { AppointmentId = appointmentId, Status = "Pending" };

            _doctorRepositoryMock
                .Setup(repo => repo.UpdateAppointmentStatusAsync(appointmentId, status))
                .ReturnsAsync(appointment);

            // Act
            var result = await _controller.UpdateAppointment(appointmentId, status);

            // Assert
            Assert.IsInstanceOf<NoContentResult>(result);
        }

        [Test]
        public async Task UpdateAppointment_AppointmentNotFound_ReturnsNotFound()
        {
            // Arrange
            var appointmentId = 99; // Non-existent appointment
            var status = "Completed";
            _doctorRepositoryMock
                .Setup(repo => repo.UpdateAppointmentStatusAsync(appointmentId, status))
                .ReturnsAsync((Appointment)null);

            // Act
            var result = await _controller.UpdateAppointment(appointmentId, status);

            // Assert
            Assert.IsInstanceOf<NotFoundResult>(result);
        }

        [Test]
        public async Task PrescribeMedications_ValidMedicalRecord_ReturnsNoContent()
        {
            // Arrange
            var prescribeDTO = new PrescribeDTO
            {
                MedicalRecordId = 1,
                MedicineName = "Paracetamol",
                MedicineFrequency = "Twice a day",
                MedicineTime = "Morning, Evening"
            };

            _doctorRepositoryMock
                .Setup(repo => repo.PrescribeMedicationsAsync(
                    prescribeDTO.MedicalRecordId, prescribeDTO.MedicineName, prescribeDTO.MedicineFrequency, prescribeDTO.MedicineTime))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.PrescribeMedications(prescribeDTO);

            // Assert
            Assert.IsInstanceOf<NoContentResult>(result);
        }

    }
}
