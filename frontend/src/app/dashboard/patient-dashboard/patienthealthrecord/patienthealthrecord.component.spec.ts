import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatienthealthrecordComponent } from './patienthealthrecord.component';

describe('PatienthealthrecordComponent', () => {
  let component: PatienthealthrecordComponent;
  let fixture: ComponentFixture<PatienthealthrecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatienthealthrecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatienthealthrecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
