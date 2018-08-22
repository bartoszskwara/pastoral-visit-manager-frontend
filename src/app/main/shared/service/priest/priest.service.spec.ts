import {inject, TestBed} from '@angular/core/testing';

import {PriestService} from './priest.service';

describe('PriestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriestService]
    });
  });

  it('should be created', inject([PriestService], (service: PriestService) => {
    expect(service).toBeTruthy();
  }));
});
