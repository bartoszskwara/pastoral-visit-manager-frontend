import {inject, TestBed} from '@angular/core/testing';

import {AddressDetailsService} from './address-details.service';

describe('AddressDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddressDetailsService]
    });
  });

  it('should be created', inject([AddressDetailsService], (service: AddressDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
