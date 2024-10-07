using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AmazeCareClass.DTO
{
    public class PatientRegisterDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string BloodGroup { get; set; }
        public string KnownAllergies { get; set; }
        public string CurrentMedication { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
