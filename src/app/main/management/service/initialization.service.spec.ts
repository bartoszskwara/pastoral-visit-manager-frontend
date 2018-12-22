import { TestBed, inject } from '@angular/core/testing';

import { InitializationService } from './initialization.service';

describe('InitializationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitializationService]
    });
  });

  it('should be created', inject([InitializationService], (service: InitializationService) => {
    expect(service).toBeTruthy();
  }));
});
