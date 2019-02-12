import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePrivilagesComponent } from './manage-privilages.component';

describe('ManagePrivilagesComponent', () => {
  let component: ManagePrivilagesComponent;
  let fixture: ComponentFixture<ManagePrivilagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePrivilagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePrivilagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
