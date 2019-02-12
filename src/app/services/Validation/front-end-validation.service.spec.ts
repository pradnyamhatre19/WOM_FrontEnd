import { TestBed, inject } from '@angular/core/testing';

import { FrontEndValidationService } from './front-end-validation.service';

describe('FrontEndValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FrontEndValidationService]
    });
  });

  it('should be created', inject([FrontEndValidationService], (service: FrontEndValidationService) => {
    expect(service).toBeTruthy();
  }));
});
