import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientmedicationComponent } from './patientmedication.component';

describe('PatientmedicationComponent', () => {
  let component: PatientmedicationComponent;
  let fixture: ComponentFixture<PatientmedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientmedicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientmedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
