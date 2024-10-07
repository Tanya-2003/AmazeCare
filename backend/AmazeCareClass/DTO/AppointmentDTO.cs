using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AmazeCareClass.DTO;

namespace AmazeCareClass.DTO
{
    public class AppointmentDTO
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; }
        public string? Remarks { get; set; }
        //public TimeOnly AppointmentTime { get; set; }
    }
}
