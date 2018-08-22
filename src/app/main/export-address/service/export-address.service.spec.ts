import { TestBed, inject } from '@angular/core/testing';

import { ExportAddressService } from './export-address.service';

describe('ExportAddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportAddressService]
    });
  });

  it('should be created', inject([ExportAddressService], (service: ExportAddressService) => {
    expect(service).toBeTruthy();
  }));
});
