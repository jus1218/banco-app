import { TestBed } from '@angular/core/testing';

import { LeagerAccountsService } from './leager-accounts.service';

describe('LeagerAccountsService', () => {
  let service: LeagerAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeagerAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
