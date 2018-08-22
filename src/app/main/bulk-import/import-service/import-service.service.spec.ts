import { TestBed, inject } from '@angular/core/testing';

import { ImportService\importServiceService } from './import-service\import-service.service';

describe('ImportService\importServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImportService\importServiceService]
    });
  });

  it('should be created', inject([ImportService\importServiceService], (service: ImportService\importServiceService) => {
    expect(service).toBeTruthy();
  }));
});
