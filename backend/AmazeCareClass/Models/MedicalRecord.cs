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
    public class MedicalRecord
    {
        [Key]
        public int RecordId { get; set; }
        public int PatientId { get; set; }
        [ForeignKey(nameof(PatientId))]
        [JsonIgnore]
        public virtual Patient? Patient { get; set; }
        public int DoctorId { get; set; }
        [ForeignKey(nameof(DoctorId))]
        [JsonIgnore]
        public virtual Doctor? Doctor { get; set; }
        public int AppointmentId { get; set; }
        [ForeignKey(nameof(AppointmentId))]
        [JsonIgnore]
        public virtual Appointment? Appointment { get; set; }
        public string Diagnosis { get; set; }
        public string MedicineName { get; set; }
        public string MedicineFrequency { get; set; }
        public string MedicineTime { get; set; }
        public string TreatmentPlan { get; set; }
        public DateTime? NextAppointmentDate { get; set; }
        public string InsuranceCoverage { get; set; }
    }
}
