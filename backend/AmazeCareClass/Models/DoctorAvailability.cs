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
    public class DoctorAvailability
    {
        [Key]
        public int DoctorId { get; set; }
        [ForeignKey(nameof(DoctorId))]
        [JsonIgnore]
        public virtual Doctor? Doctor { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public string DayAvailable { get; set; }
        public bool IsAvailable { get; set; }

    }
}
