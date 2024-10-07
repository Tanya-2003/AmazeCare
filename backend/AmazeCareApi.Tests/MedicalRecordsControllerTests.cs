using AmazeCareApi.Controllers;
using AmazeCareApi.Repositories;
using AmazeCareClass.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AmazeCareApi.Tests
{
    [TestFixture]
    public class MedicalRecordsControllerTests
    {
        private Mock<IMedicalRecordRepository> _mockRepo;
        private MedicalRecordsController _controller;

        [SetUp]
        public void Setup()
        {
            _mockRepo = new Mock<IMedicalRecordRepository>();
            _controller = new MedicalRecordsController(_mockRepo.Object);
        }
        [Test]
        public async Task GetMedicalRecords_ReturnsOkResult_WithListOfMedicalRecords()
        {
            // Arrange
            var mockRecords = new List<MedicalRecord>
            {
                new MedicalRecord { RecordId = 1, PatientId = 123 },
                new MedicalRecord { RecordId = 2, PatientId = 456 }
            };
            _mockRepo.Setup(repo => repo.GetAllRecordsAsync()).ReturnsAsync(mockRecords);

            // Act
            var result = await _controller.GetMedicalRecords();

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(mockRecords, okResult.Value);
        }
        [Test]
        public async Task GetMedicalRecordById_RecordExists_ReturnsOkResult_WithMedicalRecord()
        {
            // Arrange
            var mockRecord = new MedicalRecord { RecordId = 1, PatientId = 123 };
            _mockRepo.Setup(repo => repo.GetRecordByIdAsync(1)).ReturnsAsync(mockRecord);

            // Act
            var result = await _controller.GetMedicalRecordById(1);

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(mockRecord, okResult.Value);
        }

        [Test]
        public async Task GetMedicalRecordById_RecordDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.GetRecordByIdAsync(1)).ReturnsAsync((MedicalRecord)null);

            // Act
            var result = await _controller.GetMedicalRecordById(1);

            // Assert
            Assert.IsInstanceOf<NotFoundResult>(result.Result);
        }

        [Test]
        public async Task AddMedicalRecord_ValidRecord_ReturnsCreatedAtActionResult()
        {
            // Arrange
            var newRecord = new MedicalRecord { RecordId = 1, PatientId = 123 };
            _mockRepo.Setup(repo => repo.AddMedicalRecordAsync(It.IsAny<MedicalRecord>())).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.AddMedicalRecord(newRecord);

            // Assert
            Assert.IsInstanceOf<CreatedAtActionResult>(result);
            var createdAtResult = result as CreatedAtActionResult;
            Assert.AreEqual("GetMedicalRecordById", createdAtResult.ActionName);
            Assert.AreEqual(newRecord.RecordId, createdAtResult.RouteValues["id"]);
        }

        [Test]
        public async Task UpdateMedicalRecord_RecordIdMismatch_ReturnsBadRequest()
        {
            // Arrange
            var recordToUpdate = new MedicalRecord { RecordId = 2, PatientId = 123 };

            // Act
            var result = await _controller.UpdateMedicalRecord(1, recordToUpdate);

            // Assert
            Assert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task DeleteMedicalRecord_ValidRecord_ReturnsNoContent()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.DeleteMedicalRecordAsync(1)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteMedicalRecord(1);

            // Assert
            Assert.IsInstanceOf<NoContentResult>(result);
        }

        [Test]
        public async Task DeleteMedicalRecord_RecordDoesNotExist_ReturnsNoContent()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.DeleteMedicalRecordAsync(1)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteMedicalRecord(1);

            // Assert
            Assert.IsInstanceOf<NoContentResult>(result);
        }
    }
}
