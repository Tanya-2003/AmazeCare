using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AmazeCareClass.Models
{
    public class Doctor
    {
        [Key]
        public int DoctorId { get; set; }
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
        //public string ImageUrl { get; set; }

        public String Role { get; set; } = "Doctor";
        //Navigation
        [JsonIgnore]
        public virtual ICollection<Appointment> Appointments { get; set; }
        [JsonIgnore]
        public virtual ICollection<Bill> Bills { get; set; }
        [JsonIgnore]
        public virtual ICollection<MedicalRecord> MedicalRecords { get; set; }
    }
}
