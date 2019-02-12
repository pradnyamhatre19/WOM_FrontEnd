import { TestBed, inject } from '@angular/core/testing';

import { CommonCallService } from './common-call.service';

describe('CommonCallService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonCallService]
    });
  });

  it('should be created', inject([CommonCallService], (service: CommonCallService) => {
    expect(service).toBeTruthy();
  }));
});
