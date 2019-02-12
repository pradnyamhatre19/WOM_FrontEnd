import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpinformationComponent } from './empinformation.component';

describe('EmpinformationComponent', () => {
  let component: EmpinformationComponent;
  let fixture: ComponentFixture<EmpinformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpinformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
