import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BOQDetailComponent } from './boqdetail.component';

describe('BOQDetailComponent', () => {
  let component: BOQDetailComponent;
  let fixture: ComponentFixture<BOQDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BOQDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BOQDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
