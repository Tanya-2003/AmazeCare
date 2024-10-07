import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorrecordComponent } from './doctorrecord.component';

describe('DoctorrecordComponent', () => {
  let component: DoctorrecordComponent;
  let fixture: ComponentFixture<DoctorrecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorrecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorrecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
