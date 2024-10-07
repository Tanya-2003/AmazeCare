//using System;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;
//using System.Linq;
//using System.Text;
//using System.Text.Json.Serialization;
//using System.Threading.Tasks;

//namespace AmazeCareClass.Models
//{
//    public class Department
//    {
//        [Key]
//        public int DepartmentId { get; set; }
//        public string DepartmentName { get; set; }
//        public int DoctorId { get; set; }
//        [ForeignKey(nameof(DoctorId))]
//        [JsonIgnore]
//        public virtual Doctor? Doctor { get; set; }
//        public string DoctorName { get; set; }

//    }
//}
