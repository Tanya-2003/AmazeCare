import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorscheduleComponent } from './doctorschedule.component';

describe('DoctorscheduleComponent', () => {
  let component: DoctorscheduleComponent;
  let fixture: ComponentFixture<DoctorscheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorscheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
