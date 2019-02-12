import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningTableComponent } from './planning-table.component';

describe('PlanningTableComponent', () => {
  let component: PlanningTableComponent;
  let fixture: ComponentFixture<PlanningTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
