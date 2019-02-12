import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewProjectPageComponent } from './add-new-project-page.component';

describe('AddNewProjectPageComponent', () => {
  let component: AddNewProjectPageComponent;
  let fixture: ComponentFixture<AddNewProjectPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewProjectPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewProjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
