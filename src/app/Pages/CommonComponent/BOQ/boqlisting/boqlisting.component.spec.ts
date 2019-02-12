import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BOQListingComponent } from './boqlisting.component';

describe('BOQListingComponent', () => {
  let component: BOQListingComponent;
  let fixture: ComponentFixture<BOQListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BOQListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BOQListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
