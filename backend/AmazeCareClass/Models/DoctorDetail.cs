using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AmazeCareClass.Models
{
    public class DoctorDetail
    {
        //[Key]
        //public int Id { get; set; }
        //public int DoctorId { get; set; }
        //[ForeignKey(nameof(DoctorId))]
        //[JsonIgnore]
        //public virtual Doctor? Doctor { get; set; }
        //public string DoctorName { get; set; }
        //public string DepartmentName { get; set; }
        //public string Specialisation { get; set; }
        //public string About { get; set; }
        //public string ClinicalInterest { get; set; }
        //public string Email { get; set; }
        //public string Treats { get; set; }
        ////public int ConsultationFee { get; set; }
        //[JsonIgnore]
        //public virtual ICollection<Bill> Bills { get; set; }

        [Key]
        public int DoctorId { get; set; }

        [ForeignKey(nameof(DoctorId))]
        [JsonIgnore]
        public virtual Doctor? Doctor { get; set; }

        //public string DoctorName { get; set; }
        //public string DepartmentName { get; set; }
        public string Specialisation { get; set; }
        public string About { get; set; }
        public string ClinicalInterest { get; set; }
        //public string Email { get; set; }
        public string Treats { get; set; }
        public int ConsultationFee { get; set; } // Consultation fee added
    }
}
