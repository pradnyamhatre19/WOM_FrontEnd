import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBOQComponent } from './add-boq.component';

describe('AddBOQComponent', () => {
  let component: AddBOQComponent;
  let fixture: ComponentFixture<AddBOQComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBOQComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBOQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
