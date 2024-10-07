using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AmazeCareClass.Models;
using Microsoft.EntityFrameworkCore;

namespace AmazeCareClass.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Bill> Bills { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        //public DbSet<Department> Departments { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<DoctorAvailability> DoctorAvailabilities { get; set; }
        public DbSet<DoctorDetail> DoctorDetails { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<UserLogin> UserLogins { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<DoctorAvailability>()
            //    .HasNoKey();
            ////modelBuilder.Entity<DoctorDetail>()
            ////    .HasNoKey();
            //modelBuilder.Entity<Booking>()
            //    .HasNoKey();
            //modelBuilder.Entity<UserLogin>()
            //     .HasNoKey();


            //modelBuilder.Entity<Bill>()
            //    .HasOne(b => b.Doctor)
            //    .WithMany()
            //    .HasForeignKey(b => b.DoctorId)
            //     .OnDelete(DeleteBehavior.Restrict);

            //modelBuilder.Entity<Bill>()
            //    .HasOne(b => b.Patient)
            //    .WithMany()
            //    .HasForeignKey(b => b.PatientId)
            //    .OnDelete(DeleteBehavior.Restrict);

            //modelBuilder.Entity<DoctorDetail>()
            //   .HasKey(dd => dd.DoctorId);

            //// 1. Patient -> Bill relationship (Delete Behavior: Cascade)
            //modelBuilder.Entity<Bill>()
            //    .HasOne(b => b.Patient)
            //    .WithMany(p => p.Bills)
            //    .HasForeignKey(b => b.PatientId)
            //    .OnDelete(DeleteBehavior.Cascade);  // When Patient is deleted, delete related Bills

            //// 2. Patient -> Appointment relationship (Delete Behavior: Cascade)
            //modelBuilder.Entity<Appointment>()
            //    .HasOne(a => a.Patient)
            //    .WithMany(p => p.Appointments)
            //    .HasForeignKey(a => a.PatientId)
            //    .OnDelete(DeleteBehavior.Cascade);  // When Patient is deleted, delete related Appointments

            //// 3. Patient -> MedicalRecord relationship (Delete Behavior: Cascade)
            //modelBuilder.Entity<MedicalRecord>()
            //    .HasOne(mr => mr.Patient)
            //    .WithMany(p => p.MedicalRecords)
            //    .HasForeignKey(mr => mr.PatientId)
            //    .OnDelete(DeleteBehavior.Cascade);  // When Patient is deleted, delete related Medical Records

            //// 4. Doctor -> Appointment relationship (Delete Behavior: Cascade)
            //modelBuilder.Entity<Appointment>()
            //    .HasOne(a => a.Doctor)
            //    .WithMany(d => d.Appointments)
            //    .HasForeignKey(a => a.DoctorId)
            //    .OnDelete(DeleteBehavior.Cascade);  // When Doctor is deleted, delete related Appointments

            //// 5. Doctor -> Bill relationship (Delete Behavior: No Action)
            ////modelBuilder.Entity<Bill>()
            ////    .HasOne(b => b.Doctor)
            ////    .WithMany(d => d.Bills)
            ////    .HasForeignKey(b => b.DoctorId)
            ////    .OnDelete(DeleteBehavior.NoAction);  // When Doctor is deleted, do not delete related Bills

            //// 6. Doctor -> MedicalRecord relationship (Delete Behavior: No Action)
            //modelBuilder.Entity<MedicalRecord>()
            //    .HasOne(mr => mr.Doctor)
            //    .WithMany(d => d.MedicalRecords)
            //    .HasForeignKey(mr => mr.DoctorId)
            //    .OnDelete(DeleteBehavior.NoAction);  // When Doctor is deleted, do not delete related Medical Records

            //// 7. Bill -> Patient relationship (Delete Behavior: No Action)
            //modelBuilder.Entity<Bill>()
            //    .HasOne(b => b.Patient)
            //    .WithMany(p => p.Bills)
            //    .HasForeignKey(b => b.PatientId)
            //    .OnDelete(DeleteBehavior.NoAction);  // Deleting a Bill does not affect Patient

            //// 8. Bill -> Doctor relationship (Delete Behavior: No Action)
            ////modelBuilder.Entity<Bill>()
            ////.HasOne(b => b.Doctor)
            ////.WithMany(d => d.Bills)
            ////.HasForeignKey(b => b.DoctorId)
            ////.OnDelete(DeleteBehavior.NoAction);  // Deleting a Bill does not affect Doctor

            //// 9. Appointment -> Patient relationship (Delete Behavior: No Action)
            //modelBuilder.Entity<Appointment>()
            //    .HasOne(a => a.Patient)
            //    .WithMany(p => p.Appointments)
            //    .HasForeignKey(a => a.PatientId)
            //    .OnDelete(DeleteBehavior.NoAction);  // Deleting an Appointment does not affect Patient

            //// 10. Appointment -> Doctor relationship (Delete Behavior: No Action)
            //modelBuilder.Entity<Appointment>()
            //    .HasOne(a => a.Doctor)
            //    .WithMany(d => d.Appointments)
            //    .HasForeignKey(a => a.DoctorId)
            //    .OnDelete(DeleteBehavior.NoAction);  // Deleting an Appointment does not affect Doctor

            //// 11. MedicalRecord -> Patient relationship (Delete Behavior: No Action)
            //modelBuilder.Entity<MedicalRecord>()
            //    .HasOne(mr => mr.Patient)
            //    .WithMany(p => p.MedicalRecords)
            //    .HasForeignKey(mr => mr.PatientId)
            //    .OnDelete(DeleteBehavior.NoAction);  // Deleting a MedicalRecord does not affect Patient

            //// 12. MedicalRecord -> Doctor relationship (Delete Behavior: No Action)
            //modelBuilder.Entity<MedicalRecord>()
            //    .HasOne(mr => mr.Doctor)
            //    .WithMany(d => d.MedicalRecords)
            //    .HasForeignKey(mr => mr.DoctorId)
            //    .OnDelete(DeleteBehavior.NoAction);  // Deleting a MedicalRecord does not affect Doctor

            base.OnModelCreating(modelBuilder);

        }
    }
}
