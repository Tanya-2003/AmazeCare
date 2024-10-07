import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecordComponent } from './admin-record.component';

describe('AdminRecordComponent', () => {
  let component: AdminRecordComponent;
  let fixture: ComponentFixture<AdminRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
