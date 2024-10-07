using AmazeCareApi.Service;
using AmazeCareClass.Data;
using AmazeCareClass.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AmazeCareApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly AppDbContext _context;
        private readonly TokenGeneration _tokenGeneration;

        public AuthController(AppDbContext context, TokenGeneration tokenGeneration)
        {
            _context = context;
            _tokenGeneration = tokenGeneration;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] UserLogin login)
        {
            if (login == null || string.IsNullOrWhiteSpace(login.Username) || string.IsNullOrWhiteSpace(login.Password))
            {
                return BadRequest("Invalid login request.");
            }

            // Check if the user is an Admin
            var admin = await _context.Admins
                .FirstOrDefaultAsync(a => a.Username == login.Username && a.Password == login.Password);

            if (admin != null)
            {
                var token = _tokenGeneration.GenerateJWT(
                    userId: admin.Id.ToString(),
                    role: "Admin",
                    department: "Admin Department",
                    accessLevel: "Level-A"
                );
                //return Ok(new { userId = admin.Id, token }); // Include user ID in response
                return Ok(new { userId = admin.Id, token, role = "Admin" }); // Include user ID, token, and role in response
            }

            // Check if the user is a Doctor
            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.Username == login.Username && d.Password == login.Password);

            if (doctor != null)
            {
                var token = _tokenGeneration.GenerateJWT(
                    userId: doctor.DoctorId.ToString(),
                    role: "Doctor",
                    department: doctor.Specialisation,
                    accessLevel: "Level-D"
                );
                //return Ok(new { userId = doctor.DoctorId, token }); // Include user ID in response
                return Ok(new { userId = doctor.DoctorId, token, role = "Doctor" }); // Include user ID, token, and role in response
            }

            // Check if the user is a Patient
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.Username == login.Username && p.Password == login.Password);

            if (patient != null)
            {
                var token = _tokenGeneration.GenerateJWT(
                    userId: patient.PatientId.ToString(),
                    role: "Patient",
                    department: "Patient Department",
                    accessLevel: "Level-P"
                );
                //return Ok(new { userId = patient.PatientId, token }); // Include user ID in response
                return Ok(new { userId = patient.PatientId, token, role = "Patient" }); // Include user ID, token, and role in response
            }

            // If no match is found, return unauthorized
            return Unauthorized("Invalid username or password");
        }
    }
}
