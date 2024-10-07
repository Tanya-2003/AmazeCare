import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DoctorService {
    private doctors = [
        { 
            name: 'Shaun Murphy', 
            speciality: 'Cancer Care', 
            image: 'assets/doctor-card/shawn.jpg', 
            departmentAvatar: 'assets/doctor-card/cancer-care.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in Cancer Care, Dr. Shaun Murphy combines advanced medical knowledge with a patient-centered approach to deliver personalized care.',
            experience: 10,
            qualification: 'MD, Oncology Specialist'
        },
        { 
            name: 'Marcel Andrew', 
            speciality: 'Cardiology', 
            image: 'assets/doctor-card/andrew.jpg', 
            departmentAvatar: 'assets/doctor-card/cardiology.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in Cardiology, Dr. Marcel Andrew is committed to improving cardiovascular health and patient well-being.',
            experience: 15,
            qualification: 'MD, FACC (Fellow of the American College of Cardiology)'
        },
        { 
            name: 'Asher Lupin', 
            speciality: 'Pediatrician', 
            image: 'assets/doctor-card/asher.jpg', 
            departmentAvatar: 'assets/doctor-card/newborn-services.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in Pediatrics, Dr. Asher Lupin focuses on the health and well-being of children with a caring and patient-centered approach.',
            experience: 8,
            qualification: 'MD, FAAP (Fellow of the American Academy of Pediatrics)'
        },
        { 
            name: 'Charlie Smith', 
            speciality: 'Dental Care', 
            image: 'assets/doctor-card/charlie.jpg', 
            departmentAvatar: 'assets/doctor-card/dental-care.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in Dental Care, Dr. Charlie Smith offers expert dental services with a focus on patient comfort and care.',
            experience: 12,
            qualification: 'DDS (Doctor of Dental Surgery)'
        },
        { 
            name: 'Christina Young', 
            speciality: 'General Surgery', 
            image: 'assets/doctor-card/christina-yang.jpg', 
            departmentAvatar: 'assets/doctor-card/general-surgery.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in General Surgery, Dr. Christina Young is committed to delivering top-quality surgical care and patient safety.',
            experience: 18,
            qualification: 'MD, FACS (Fellow of the American College of Surgeons)'
        },
        { 
            name: 'Claire Brown', 
            speciality: 'Kidney Care', 
            image: 'assets/doctor-card/claire.jpg', 
            departmentAvatar: 'assets/doctor-card/kidney-care.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in Kidney Care, Dr. Claire Brown offers personalized treatment for patients with kidney conditions.',
            experience: 9,
            qualification: 'MD, Nephrology Specialist'
        },
        { 
            name: 'Ellen Pompeo', 
            speciality: 'Long Term Acute Care', 
            image: 'assets/doctor-card/ellen-pompeo.jpg', 
            departmentAvatar: 'assets/doctor-card/long-term-acute-care.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in Long Term Acute Care, Dr. Ellen Pompeo ensures the best outcomes for patients requiring extended hospital care.',
            experience: 20,
            qualification: 'MD, Internal Medicine Specialist'
        },
        { 
            name: 'Jared Kalu', 
            speciality: 'Neurosurgery', 
            image: 'assets/doctor-card/jared.jpg', 
            departmentAvatar: 'assets/doctor-card/neurosurgery.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in Neurosurgery, Dr. Jared Kalu combines expertise and compassion to treat complex neurological conditions.',
            experience: 13,
            qualification: 'MD, Neurosurgeon'
        },
        { 
            name: 'Jordan Smith', 
            speciality: 'Radiation Oncology', 
            image: 'assets/doctor-card/jordan.png', 
            departmentAvatar: 'assets/doctor-card/radiation-oncology.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in Radiation Oncology, Dr. Jordan Smith offers advanced cancer treatment with a focus on patient care.',
            experience: 7,
            qualification: 'MD, Radiation Oncologist'
        },
        { 
            name: 'Leah Dilalo', 
            speciality: 'Stroke Care', 
            image: 'assets/doctor-card/leah.jpeg', 
            departmentAvatar: 'assets/doctor-card/stroke-care.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in Stroke Care, Dr. Leah Dilalo is dedicated to helping patients recover and improve their quality of life after a stroke.',
            experience: 11,
            qualification: 'MD, Neurologist'
        },
        { 
            name: 'Andrew Lim', 
            speciality: 'Women Health', 
            image: 'assets/doctor-card/lim.jpg', 
            departmentAvatar: 'assets/doctor-card/women-health.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in Women’s Health, Dr. Andrew Lim offers personalized care to promote women’s overall health and wellness.',
            experience: 10,
            qualification: 'MD, Obstetrics and Gynecology Specialist'
        },
        { 
            name: 'Nike Melendez', 
            speciality: 'Radiation Oncology', 
            image: 'assets/doctor-card/melendez.jpg', 
            departmentAvatar: 'assets/doctor-card/radiation-oncology.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in Radiation Oncology, Dr. Nike Melendez offers cutting-edge cancer treatment with a focus on patient-centered care.',
            experience: 14,
            qualification: 'MD, Radiation Oncologist'
        },
        { 
            name: 'Meredith Grey', 
            speciality: 'Radiation Oncology', 
            image: 'assets/doctor-card/meredith-grey.jpg', 
            departmentAvatar: 'assets/doctor-card/radiation-oncology.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in Radiation Oncology, Dr. Meredith Grey is committed to delivering the highest standard of care to cancer patients.',
            experience: 16,
            qualification: 'MD, Radiation Oncologist'
        },
        { 
            name: 'Glen Morgan', 
            speciality: 'Cancer Care', 
            image: 'assets/doctor-card/morgan.jpeg', 
            departmentAvatar: 'assets/doctor-card/cancer-care.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in Cancer Care, Dr. Glen Morgan offers personalized treatment plans to improve patient outcomes.',
            experience: 12,
            qualification: 'MD, Oncology Specialist'
        },
        { 
            name: 'Patrick Dempsey', 
            speciality: 'Cardiologist', 
            image: 'assets/doctor-card/patrick-dempsey.jpg', 
            departmentAvatar: 'assets/doctor-card/cardiology.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in Cardiology, Dr. Patrick Dempsey provides expert care to manage and improve heart health.',
            experience: 20,
            qualification: 'MD, FACC (Fellow of the American College of Cardiology)'
        },
        { 
            name: 'Sarah Drew', 
            speciality: 'General Surgery', 
            image: 'assets/doctor-card/sarah-drew.jpg', 
            departmentAvatar: 'assets/doctor-card/general-surgery.png',
            bio: 'A highly skilled and compassionate medical professional dedicated to providing exceptional healthcare. Specializing in General Surgery, Dr. Sarah Drew is committed to performing precise surgical procedures and ensuring patient recovery.',
            experience: 14,
            qualification: 'MD, FACS (Fellow of the American College of Surgeons)'
        }
    ];

    constructor() {}

    getDoctorByName(name: string): Observable<any> {
        const doctor = this.doctors.find(doc => doc.name === decodeURIComponent(name));
        return of(doctor); // Simulate an Observable of doctor details
    }
}
