import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientscheduleComponent } from './patientschedule.component';

describe('PatientscheduleComponent', () => {
  let component: PatientscheduleComponent;
  let fixture: ComponentFixture<PatientscheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientscheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
