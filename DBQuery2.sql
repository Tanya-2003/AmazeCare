create database AmazeCare1

select * from Admins
select * from Appointments
select * from Bills
select * from Bookings
select * from DoctorAvailabilities
select * from DoctorDetails
select * from Doctors
select * from MedicalRecords
select * from Patients
select * from UserLogins


INSERT INTO Patients(FirstName, LastName, DateOfBirth, Gender, Email, Address, BloodGroup, KnownAllergies, CurrentMedication, Username, Password, Role,ImageUrl)
VALUES 
('Daphne', 'Bridgerton', '1990-01-01', 'Female', 'daphne@gmail.com', 'Mayfair, London', 'A+', 'None', 'None', 'DaphneBr', 'Daphne@123', 'Patient','http://localhost:4200/assets/user/daphne.jpeg'),
('Simon', 'Basset', '1988-06-17', 'Male', 'simon@gmail.com', 'Grosvenor Square, London', 'B+', 'Peanuts', 'None', 'SimonBa', 'Simon@123', 'Patient','http://localhost:4200/assets/user/simon.jpg'),
('Anthony', 'Bridgerton', '1985-09-21', 'Male', 'anthony@gmail.com', 'Mayfair, London', 'O-', 'None', 'None', 'AnthonyBr', 'Anthony@123', 'Patient','http://localhost:4200/assets/user/anthony.jpg'),
('Benedict', 'Bridgerton', '1987-03-14', 'Male', 'benedict@gmail.com', 'Mayfair, London', 'A-', 'Pollen', 'None', 'BenedictBr', 'Benedict@123', 'Patient','http://localhost:4200/assets/user/benedict.jpeg'),
('Colin', 'Bridgerton', '1989-08-10', 'Male', 'colin@gmail.com', 'Mayfair, London', 'B+', 'None', 'None', 'ColinBr', 'Colin@123', 'Patient','http://localhost:4200/assets/user/colin.jpg'),
('Eloise', 'Bridgerton', '1993-12-05', 'Female', 'eloise@gmail.com', 'Mayfair, London', 'O+', 'None', 'None', 'EloiseBr', 'Eloise@123', 'Patient','http://localhost:4200/assets/user/eloise.jpg'),
('Penelope', 'Featherington', '1994-04-12', 'Female', 'penelope@gmail.com', 'Grosvenor Square, London', 'AB+', 'Gluten', 'None', 'PenelopeFe', 'Penelope@123', 'Patient','http://localhost:4200/assets/user/penelope.jpg'),
('Francesca', 'Bridgerton', '1995-07-01', 'Female', 'francesca@gmail.com', 'Mayfair, London', 'A+', 'None', 'None', 'FrancescaBr', 'Francesca@123', 'Patient','http://localhost:4200/assets/user/francesca.jpeg'),
('Hyacinth', 'Bridgerton', '1999-11-15', 'Female', 'hyacinth@gmail.com', 'Mayfair, London', 'B-', 'None', 'None', 'HyacinthBr', 'Hyacinth@123', 'Patient','http://localhost:4200/assets/user/hyacinth.jpeg'),
('Gregory', 'Bridgerton', '1997-02-23', 'Male', 'gregory@gmail.com', 'Mayfair, London', 'O+', 'None', 'None', 'GregoryBr', 'Gregory@123', 'Patient','http://localhost:4200/assets/user/gregory.jpeg'),
('Phillip', 'Crane', '1983-10-02', 'Male', 'phillip@gmail.com', 'Grosvenor Square, London', 'A-', 'Dust', 'None', 'PhillipCr', 'Phillip@123', 'Patient','http://localhost:4200/assets/user/philip.png');

INSERT INTO Doctors (FirstName, LastName, DateOfBirth, Gender, PhoneNumber, SecondaryPhoneNumber, Email, Specialisation, LicenseNumber, Username, Password, YearsOfExperience, Role,ImageUrl)
VALUES 
('Shaun', 'Murphy', '1989-04-02', 'Male', '1234567890', '0987654321', 'shaun@gmail.com', 'Neurosurgery', 'LN12345', 'ShaunMu', 'Shaun@123', 5, 'Doctor','http://localhost:4200/assets/doctor-card/shawn.jpeg'),
('Claire', 'Browne', '1990-07-12', 'Female', '2234567890', '1987654321', 'claire@gmail.com', 'Neurosurgery', 'LN12346', 'ClaireBr', 'Claire@123', 4, 'Doctor','http://localhost:4200/assets/doctor-card/claire.jpeg'),
('Neil', 'Melendez', '1980-03-25', 'Male', '3234567890', '2987654321', 'neil@gmail.com', 'General-Surgery', 'LN12347', 'NeilMe', 'Neil@123', 10, 'Doctor','http://localhost:4200/assets/doctor-card/niel.jpg'),
('Audrey', 'Lim', '1982-10-11', 'Female', '4234567890', '3987654321', 'audrey@gmail.com', 'General-Surgery', 'LN12348', 'AudreyLi', 'Audrey@123', 9, 'Doctor','http://localhost:4200/assets/doctor-card/audrey.jpg'),
('Marcus', 'Andrews', '1975-02-15', 'Male', '5234567890', '4987654321', 'marcus@gmail.com', 'Cardiology', 'LN12349', 'MarcusAn', 'Marcus@123', 15, 'Doctor','http://localhost:4200/assets/doctor-card/marcus.jpeg'),
('Aaron', 'Glassman', '1965-11-04', 'Male', '6234567890', '5987654321', 'aaron@gmail.com', 'Cardiology', 'LN12350', 'AaronGl', 'Aaron@123', 20, 'Doctor','http://localhost:4200/assets/doctor-card/aaron.jpg'),
('Morgan', 'Reznick', '1987-08-18', 'Female', '7234567890', '6987654321', 'morgan@gmail.com', 'Dental-Care', 'LN12351', 'MorganRe', 'Morgan@123', 7, 'Doctor','http://localhost:4200/assets/doctor-card/morgan.jpeg'),
('Jordan', 'Allen', '1991-09-29', 'Female', '8234567890', '7987654321', 'jordan@gmail.com', 'Dental-Care', 'LN12352', 'JordanAl', 'Jordan@123', 3, 'Doctor','http://localhost:4200/assets/doctor-card/jordan.jpeg'),
('Alex', 'Park', '1984-12-22', 'Male', '9234567890', '8987654321', 'alex@gmail.com', 'Cancer-Care', 'LN12353', 'AlexPa', 'Alex@123', 6, 'Doctor','http://localhost:4200/assets/doctor-card/alex.jpeg'),
('Lea', 'Dilallo', '1992-06-30', 'Female', '1334567890', '1387654321', 'lea@gmail.com', 'Cancer-Care', 'LN12354', 'LeaDi', 'Lea@123', 4, 'Doctor','http://localhost:4200/assets/doctor-card/lea.jpeg'),
('Carly', 'Lever', '1986-01-19', 'Female', '2334567890', '2387654321', 'carly@gmail.com', 'Stroke-Care', 'LN12355', 'CarlyLe', 'Carly@123', 8, 'Doctor','http://localhost:4200/assets/doctor-card/carly.jpeg'),
('Jessica', 'Preston', '1985-05-05', 'Female', '3334567890', '3387654321', 'jessica@gmail.com', 'Stroke-Care', 'LN12356', 'JessicaPr', 'Jessica@123', 9, 'Doctor','http://localhost:4200/assets/doctor-card/jessica.jpeg'),
('Andrews', 'Green', '1981-07-07', 'Male', '4334567890', '4387654321', 'andrews@gmail.com', 'Newborn-Services', 'LN12357', 'AndrewsGr', 'Andrews@123', 12, 'Doctor','http://localhost:4200/assets/doctor-card/andrews.jpeg'),
('Tamara', 'Kendrick', '1993-03-14', 'Female', '5334567890', '5387654321', 'tamara@gmail.com', 'Newborn-Services', 'LN12358', 'TamaraKe', 'Tamara@123', 4, 'Doctor','http://localhost:4200/assets/doctor-card/tamara.jpeg'),
('Chris', 'Harrison', '1979-09-10', 'Male', '6334567890', '6387654321', 'chris@gmail.com', 'Women-Health', 'LN12359', 'ChrisHa', 'Chris@123', 10, 'Doctor','http://localhost:4200/assets/doctor-card/chris.jpeg'),
('Sarah', 'Jones', '1988-12-25', 'Female', '7334567890', '7387654321', 'sarah@gmail.com', 'Women-Health', 'LN12360', 'SarahJo', 'Sarah@123', 5, 'Doctor','http://localhost:4200/assets/doctor-card/sarah.jpeg'),
('Bobby', 'Sampson', '1983-04-20', 'Male', '8334567890', '8387654321', 'bobby@gmail.com', 'Kidney-Care', 'LN12361', 'BobbySa', 'Bobby@123', 8, 'Doctor','http://localhost:4200/assets/doctor-card/bobby.jpeg'),
('Sophie', 'Clark', '1984-11-08', 'Female', '9334567890', '9387654321', 'sophie@gmail.com', 'Kidney-Care', 'LN12362', 'SophieCl', 'Sophie@123', 7, 'Doctor','http://localhost:4200/assets/doctor-card/sophie.jpeg'),
('Ethan', 'Chapman', '1982-06-16', 'Male', '1434567890', '1487654321', 'ethan@gmail.com', 'Radiation-Oncology', 'LN12363', 'EthanCh', 'Ethan@123', 9, 'Doctor','http://localhost:4200/assets/doctor-card/ethan.jpeg'),
('Gina', 'Rodriguez', '1985-10-19', 'Female', '2434567890', '2487654321', 'gina@gmail.com', 'Radiation-Oncology', 'LN12364', 'GinaRo', 'Gina@123', 6, 'Doctor','http://localhost:4200/assets/doctor-card/gina.jpg'),
('Luke', 'Matthews', '1980-02-02', 'Male', '3434567890', '3487654321', 'luke@gmail.com', 'Long-Term-Acute-Care', 'LN12365', 'LukeMa', 'Luke@123', 11, 'Doctor','http://localhost:4200/assets/doctor-card/luke.jpeg'),
('Rachel', 'Taylor', '1990-09-05', 'Female', '4434567890', '4487654321', 'rachel@gmail.com', 'Long-Term-Acute-Care', 'LN12366', 'RachelTa', 'Rachel@123', 5, 'Doctor','http://localhost:4200/assets/doctor-card/rachel.jpg');

INSERT INTO Appointments (PatientId, DoctorId, AppointmentDate, Status, Remarks)
VALUES
-- Patient 1 and Doctor 1
(11, 1, '2024-09-01 10:00:00', 'Completed', 'Neurological consultation'),
(11, 1, '2024-09-10 09:00:00', 'Completed', 'Follow-up on neurological symptoms'),

-- Patient 2 and Doctor 2
(2, 2, '2024-08-25 11:00:00', 'Completed', 'Post-surgery review'),
(2, 2, '2024-09-12 10:30:00', 'Completed', 'Neurology consultation'),

-- Patient 3 and Doctor 3
(3, 3, '2024-08-20 09:00:00', 'Completed', 'General surgery check-up'),
(3, 3, '2024-09-05 08:30:00', 'Completed', 'Abdominal surgery consultation'),

-- Patient 4 and Doctor 4
(4, 4, '2024-09-03 12:30:00', 'Cancelled', 'General surgery consultation rescheduled'),
(4, 4, '2024-09-07 13:00:00', 'Completed', 'General surgery review'),

-- Patient 5 and Doctor 5
(5, 5, '2024-09-04 14:00:00', 'Completed', 'Cardiology appointment'),
(5, 5, '2024-09-08 11:30:00', 'Completed', 'Cardiac check-up'),

-- Patient 6 and Doctor 6
(6, 6, '2024-08-21 09:45:00', 'Completed', 'Cardiac surgery review'),
(6, 6, '2024-09-02 10:15:00', 'Completed', 'Heart condition consultation'),

-- Patient 7 and Doctor 7
(7, 7, '2024-09-02 15:00:00', 'Completed', 'Dental check-up'),
(7, 7, '2024-09-09 16:30:00', 'Completed', 'Dental consultation'),

-- Patient 8 and Doctor 8
(8, 8, '2024-08-28 11:00:00', 'Completed', 'Tooth extraction consultation'),
(8, 8, '2024-09-06 13:00:00', 'Completed', 'Dental cleaning'),

-- Patient 9 and Doctor 9
(9, 9, '2024-08-18 10:00:00', 'Completed', 'Cancer treatment options'),
(9, 9, '2024-09-05 14:30:00', 'Completed', 'Oncology consultation'),

-- Patient 10 and Doctor 10
(10, 10, '2024-09-01 17:00:00', 'Completed', 'Cancer therapy follow-up'),
(10, 10, '2024-09-09 16:00:00', 'Completed', 'Oncology therapy appointment');
-- Upcoming Appointments
INSERT INTO Appointments (PatientId, DoctorId, AppointmentDate, Status, Remarks)
VALUES
-- Patient 1 and Doctor 1
(11, 1, '2024-10-10 09:30:00', 'Confirmed', 'Neurological check-up'),
(11, 1, '2024-11-05 10:00:00', 'Confirmed', 'Neurology follow-up'),

-- Patient 2 and Doctor 2
(2, 2, '2024-10-15 11:30:00', 'Confirmed', 'Post-surgery consultation'),
(2, 2, '2024-11-08 12:00:00', 'Confirmed', 'Neurology consultation'),

-- Patient 3 and Doctor 3
(3, 3, '2024-10-12 08:00:00', 'Confirmed', 'Surgical consultation'),
(3, 3, '2024-11-02 09:30:00', 'Confirmed', 'General surgery review'),

-- Patient 4 and Doctor 4
(4, 4, '2024-10-20 14:00:00', 'Confirmed', 'General surgery follow-up'),
(4, 4, '2024-11-10 13:00:00', 'Confirmed', 'Surgical review appointment'),

-- Patient 5 and Doctor 5
(5, 5, '2024-10-17 15:00:00', 'Confirmed', 'Cardiology consultation'),
(5, 5, '2024-11-14 11:00:00', 'Confirmed', 'Heart check-up'),

-- Patient 6 and Doctor 6
(6, 6, '2024-10-11 10:00:00', 'Confirmed', 'Heart condition review'),
(6, 6, '2024-11-05 09:45:00', 'Confirmed', 'Cardiology appointment'),

-- Patient 7 and Doctor 7
(7, 7, '2024-10-18 13:30:00', 'Confirmed', 'Dental check-up'),
(7, 7, '2024-11-01 16:00:00', 'Confirmed', 'Dental follow-up'),

-- Patient 8 and Doctor 8
(8, 8, '2024-10-22 14:30:00', 'Confirmed', 'Dental consultation'),
(8, 8, '2024-11-03 11:00:00', 'Confirmed', 'Oral health check-up'),

-- Patient 9 and Doctor 9
(9, 9, '2024-10-30 15:00:00', 'Confirmed', 'Oncology appointment'),
(9, 9, '2024-11-12 12:30:00', 'Confirmed', 'Cancer treatment follow-up'),

-- Patient 10 and Doctor 10
(10, 10, '2024-10-25 16:30:00', 'Confirmed', 'Cancer therapy consultation'),
(10, 10, '2024-11-08 17:00:00', 'Confirmed', 'Oncology therapy review');

INSERT INTO MedicalRecords (PatientId, DoctorId, AppointmentId, Diagnosis, MedicineName, MedicineFrequency, MedicineTime, TreatmentPlan, NextAppointmentDate, InsuranceCoverage)
VALUES
(2, 1, 4, 'Migraine', 'Ibuprofen', 'Twice daily', 'Morning and Evening', 'Regular exercise and medication', '2024-10-12', 'Covered'),
(2, 1, 5, 'Tension Headache', 'Paracetamol', 'Once daily', 'Morning', 'Stress management', '2024-10-20', 'Covered'),
(3, 2, 6, 'Hypertension', 'Amlodipine', 'Once daily', 'Morning', 'Blood pressure monitoring', '2024-10-25', 'Partially covered'),
(3, 2, 7, 'Arrhythmia', 'Metoprolol', 'Once daily', 'Morning', 'Cardiac monitoring', '2024-10-30', 'Not covered'),
(4, 3, 8, 'Diabetes Mellitus', 'Metformin', 'Twice daily', 'Morning and Evening', 'Diet and exercise', '2024-11-05', 'Fully covered'),
(4, 3, 9, 'Thyroid Disorder', 'Levothyroxine', 'Once daily', 'Morning', 'Thyroid function test', '2024-11-10', 'Partially covered'),
(5, 4, 10, 'Asthma', 'Salbutamol', 'As needed', 'During attack', 'Inhaler and medication', '2024-11-15', 'Covered'),
(5, 4, 11, 'Bronchitis', 'Amoxicillin', 'Twice daily', 'Morning and Evening', 'Antibiotic treatment', '2024-11-20', 'Not covered');

INSERT INTO Admins (Username, Password, Role)
VALUES
('AliceJo', 'Alice@123', 'Admin'),  -- Alice Johnson
('BobSm', 'Bob@123', 'Admin');         -- Bob Smith

INSERT INTO DoctorDetails (DoctorId, Specialisation, About, ClinicalInterest, Treats, ConsultationFee)
VALUES
(1, 'Neurosurgery', 'A talented surgical resident with autism.', 'Surgery, Neuroscience', 'Epilepsy, Brain tumors', 150.00),
(2, 'Neurosurgery', 'A skilled surgeon with a passion for teaching.', 'Surgical procedures, Patient education', 'Appendicitis, Hernia repairs', 140.00),
(3, 'General Surgery', 'An experienced general surgeon known for his skills.', 'Surgical techniques, Patient safety', 'Gallbladder, Hernia repairs', 130.00),
(4, 'General Surgery', 'A dedicated surgeon with a focus on patient recovery.', 'Robotic surgery, Minimally invasive procedures', 'Hernia, Laparoscopic surgeries', 120.00),
(5, 'Cardiology', 'A cardiologist dedicated to heart health.', 'Heart disease prevention, Cardiac rehabilitation', 'Heart attack, Arrhythmia', 160.00),
(6, 'Cardiology', 'An experienced cardiologist specializing in complex cases.', 'Cardiac surgery, Heart failure management', 'Coronary artery disease, Heart valve problems', 170.00),
(7, 'Dental Care', 'A compassionate dentist focused on oral health.', 'Cosmetic dentistry, Preventive care', 'Cavities, Oral hygiene', 80.00),
(8, 'Dental Care', 'A skilled dentist specializing in family dentistry.', 'Pediatric dentistry, Preventive care', 'Teeth whitening, Root canals', 90.00),
(9, 'Cancer Care', 'An oncologist specializing in treatment for various cancers.', 'Chemotherapy, Patient support', 'Breast cancer, Lung cancer', 200.00),
(10,  'Cancer Care', 'A dedicated oncologist focused on patient care and support.', 'Radiation therapy, Clinical trials', 'Prostate cancer, Skin cancer', 210.00),
(11, 'Stroke Care', 'A neurologist specializing in stroke recovery.', 'Rehabilitation, Preventive care', 'Stroke prevention, Rehabilitation therapies', 110.00),
(12, 'Stroke Care', 'An expert in managing and preventing strokes.', 'Neurological assessments, Stroke treatment','Cerebral hemorrhage, Ischemic stroke', 120.00),
(13, 'Newborn Services', 'A pediatrician focused on the health of newborns.', 'Newborn assessments, Family education', 'Breastfeeding support, Newborn care', 100.00),
(14,  'Newborn Services', 'A caring pediatrician dedicated to newborn health.', 'Pediatric care, Vaccinations', 'Growth monitoring, Common newborn issues', 95.00),
(15, 'Women Health', 'A gynecologist specializing in women health issues.', 'Reproductive health, Family planning', 'Menstrual disorders, Contraception', 130.00),
(16, 'Women Health', 'An OB/GYN with a focus on prenatal care.', 'Pregnancy management, Gynecological surgeries', 'Pregnancy complications, Routine check-ups', 140.00),
(17, 'Kidney Care', 'A nephrologist focused on kidney health.', 'Dialysis, Kidney transplants', 'Chronic kidney disease, Nephritis', 160.00),
(18, 'Kidney Care', 'A dedicated specialist in kidney diseases.', 'Renal function management, Transplant care', 'Kidney stones, Hypertension', 150.00),
(19, 'Radiation Oncology', 'An oncologist specializing in radiation treatments.', 'Radiation therapy, Patient care', 'Breast cancer, Lung cancer', 200.00),
(20, 'Radiation Oncology', 'A compassionate oncologist focusing on radiation therapy.', 'Chemotherapy, Palliative care', 'Ovarian cancer, Pain management', 190.00),
(21,  'Long-term Acute Care', 'A physician specializing in long-term care.', 'Geriatric care, Chronic illness', 'Palliative care, Elderly care', 180.00),
(22,  'Long-term Acute Care', 'A dedicated physician focused on elderly patients.', 'Chronic care management, Rehabilitation', 'Geriatric syndromes, Chronic diseases', 175.00);

INSERT INTO DoctorAvailabilities (DoctorId, StartTime, EndTime, DayAvailable, IsAvailable)
VALUES
(1, '09:00', '17:00', 'Monday,Tuesday,Wednesday,Thursday,Friday', 1),
(2, '10:00', '18:00', 'Monday,Wednesday,Friday', 1),
(3, '08:00', '16:00', 'Monday,Tuesday,Thursday', 1),
(4, '09:00', '17:00', 'Tuesday,Thursday,Saturday', 1),
(5, '09:00', '15:00', 'Monday,Wednesday,Friday', 1),
(6, '10:00', '18:00', 'Monday,Tuesday,Thursday', 1),
(7, '09:00', '17:00', 'Tuesday,Thursday,Saturday', 1),
(8, '09:00', '17:00', 'Wednesday,Friday', 1),
(9, '10:00', '18:00', 'Monday,Wednesday', 1),
(10, '09:00', '17:00', 'Monday,Tuesday', 1),
(11, '10:00', '18:00', 'Wednesday,Friday', 1),
(12, '08:00', '16:00', 'Monday,Tuesday', 1),
(13, '09:00', '17:00', 'Monday,Thursday', 1),
(14, '09:00', '17:00', 'Tuesday,Thursday', 1),
(15, '09:00', '15:00', 'Monday,Wednesday', 1),
(16, '10:00', '18:00', 'Tuesday,Friday', 1),
(17, '09:00', '17:00', 'Monday,Thursday', 1),
(18, '09:00', '17:00', 'Tuesday,Thursday', 1),
(19, '10:00', '18:00', 'Monday,Wednesday', 1),
(20, '09:00', '17:00', 'Tuesday,Friday', 1),
(21, '10:00', '18:00', 'Wednesday,Friday', 1),
(22, '09:00', '17:00', 'Monday,Tuesday', 1);

INSERT INTO Bills(PatientId, DoctorId, AppointmentId, ConsultationFee, Total)
VALUES
(11, 1, 1, 150.00, 150.00),
(11, 1, 2, 150.00, 150.00),
(2, 2, 3, 140.00, 140.00),
(2, 2, 4, 140.00, 140.00),
(3, 3, 5, 130.00, 130.00),
(3, 3, 6, 130.00, 130.00),
(4, 4, 7, 120.00, 120.00),
(4, 4, 8, 120.00, 120.00),
(5, 5, 9, 160.00, 160.00),
(5, 5, 10, 160.00, 160.00),
(6, 6, 11, 170.00, 170.00),
(6, 6, 12, 170.00, 170.00),
(7, 7, 13, 80.00, 80.00),
(7, 7, 14, 80.00, 80.00),
(8, 8, 15, 90.00, 90.00),
(8, 8, 16, 90.00, 90.00),
(9, 9, 17, 200.00, 200.00),
(9, 9, 18, 200.00, 200.00),
(10, 10, 19, 210.00, 210.00),
(10, 10, 20, 210.00, 210.00),

(11, 1, 21, 150.00, 150.00),
(11, 1, 22, 150.00, 150.00),
(2, 2, 23, 140.00, 140.00),
(2, 2, 24, 140.00, 140.00),
(3, 3, 25, 130.00, 130.00),
(3, 3, 26, 130.00, 130.00),
(4, 4, 27, 120.00, 120.00),
(4, 4, 28, 120.00, 120.00),
(5, 5, 29, 160.00, 160.00),
(5, 5, 30, 160.00, 160.00),
(6, 6, 31, 170.00, 170.00),
(6, 6, 32, 170.00, 170.00),
(7, 7, 33, 80.00, 80.00),
(7, 7, 34, 80.00, 80.00),
(8, 8, 35, 90.00, 90.00),
(8, 8, 36, 90.00, 90.00),
(9, 9, 37, 200.00, 200.00),
(9, 9, 38, 200.00, 200.00),
(10, 10, 39, 210.00, 210.00),
(10, 10, 40, 210.00, 210.00);
