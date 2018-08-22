import { TestBed, inject } from '@angular/core/testing';

import { EditAddressService } from './edit-address.service';

describe('EditAddressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditAddressService]
    });
  });

  it('should be created', inject([EditAddressService], (service: EditAddressService) => {
    expect(service).toBeTruthy();
  }));
});
