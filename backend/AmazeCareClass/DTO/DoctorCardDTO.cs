using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AmazeCareClass.DTO
{
    public class DoctorCardDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Department { get; set; }
        public string DoctorImageUrl { get; set; }
        public string DepartmentImageUrl { get; set; }
    }
}
