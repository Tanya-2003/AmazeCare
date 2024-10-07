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
    public class Bill
    {
        //[Key]
        //public int BillId { get; set; }
        //public int PatientId { get; set; }
        //[ForeignKey(nameof(PatientId))]
        //[JsonIgnore]
        //public virtual Patient? Patient { get; set; }
        //public int DoctorId { get; set; }
        //[ForeignKey(nameof(DoctorId))]
        //[JsonIgnore]
        //public virtual DoctorDetail? Doctor { get; set; }
        //public string DoctorName { get; set; }
        //public int AppointmentId { get; set; }
        //[ForeignKey(nameof(AppointmentId))]
        //[JsonIgnore]
        //public virtual Appointment? Appointment { get; set; }
        //public int ConsultationFee { get; set; }
        //[ForeignKey(nameof(ConsultationFee))]
        //[JsonIgnore]
        //public virtual DoctorDetail? DoctorDetail { get; set; }
        //public int Total { get; set; }
        [Key]
        public int BillId { get; set; }

        public int PatientId { get; set; }
        [ForeignKey(nameof(PatientId))]
        [JsonIgnore]
        public virtual Patient? Patient { get; set; }

        public int DoctorId { get; set; }
        [ForeignKey(nameof(DoctorId))]
        [JsonIgnore]
        public virtual Doctor? Doctor { get; set; }

        //public string DoctorName { get; set; }
        public int AppointmentId { get; set; }
        [ForeignKey(nameof(AppointmentId))]
        [JsonIgnore]
        public virtual Appointment? Appointment { get; set; }

        public int ConsultationFee { get; set; } // Consultation fee added
        public int Total { get; set; }
    }
}
