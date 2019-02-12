import { TestBed, inject } from '@angular/core/testing';

import { UploadfileService } from './uploadfile.service';

describe('UploadfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploadfileService]
    });
  });

  it('should be created', inject([UploadfileService], (service: UploadfileService) => {
    expect(service).toBeTruthy();
  }));
});
