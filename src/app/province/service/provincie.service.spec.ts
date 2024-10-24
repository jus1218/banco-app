import { TestBed } from '@angular/core/testing';

import { ProvincieService } from './provincie.service';

describe('ProvincieService', () => {
  let service: ProvincieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvincieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
