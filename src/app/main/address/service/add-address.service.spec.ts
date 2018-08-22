import { TestBed, inject } from '@angular/core/testing';

import { AddAddressService } from './add-address.service';

describe('AddAddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddAddressService]
    });
  });

  it('should be created', inject([AddAddressService], (service: AddAddressService) => {
    expect(service).toBeTruthy();
  }));
});
