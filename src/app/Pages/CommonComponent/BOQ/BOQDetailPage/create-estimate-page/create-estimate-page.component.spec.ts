import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEstimatePageComponent } from './create-estimate-page.component';

describe('CreateEstimatePageComponent', () => {
  let component: CreateEstimatePageComponent;
  let fixture: ComponentFixture<CreateEstimatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEstimatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEstimatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
