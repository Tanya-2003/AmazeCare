using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AmazeCareClass.DTO
{
    public class DoctorRegisterDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string PhoneNumber { get; set; }
        public string SecondaryPhoneNumber { get; set; }
        public string Email { get; set; }
        public string Specialisation { get; set; }
        public string LicenseNumber { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int YearsOfExperience { get; set; }
        //public string ImagePath { get; set; }
    }

}
