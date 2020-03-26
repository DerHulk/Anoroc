import { TestBed } from '@angular/core/testing';

import { HopkinsDataService } from './hopkins-data.service';

describe('HopkinsDataService', () => {
  let service: HopkinsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HopkinsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
