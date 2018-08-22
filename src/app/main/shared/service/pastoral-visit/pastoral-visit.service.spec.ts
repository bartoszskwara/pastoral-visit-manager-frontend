import {inject, TestBed} from '@angular/core/testing';

import {PastoralVisitService} from './pastoral-visit.service';

describe('PastoralVisitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PastoralVisitService]
    });
  });

  it('should be created', inject([PastoralVisitService], (service: PastoralVisitService) => {
    expect(service).toBeTruthy();
  }));
});
