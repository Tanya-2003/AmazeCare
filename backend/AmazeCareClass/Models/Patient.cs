using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AmazeCareClass.Models
{
    public class Patient
    {
        [Key]
        public int PatientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime  DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string BloodGroup { get; set; }
        public string KnownAllergies { get; set; }
        public string CurrentMedication { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public String Role { get; set; } = "Patient";
        //public string ImageUrl { get; set; }


        //Navigation
        [JsonIgnore]
        public virtual ICollection<Appointment> Appointments { get; set; }
        [JsonIgnore]
        public virtual ICollection<Bill> Bills { get; set; }
        [JsonIgnore]
        public virtual ICollection<MedicalRecord> MedicalRecords { get; set; }
    }
}
