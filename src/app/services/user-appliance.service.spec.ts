import { TestBed } from '@angular/core/testing';

import { UserApplianceService } from './user-appliance.service';

describe('UserApplianceService', () => {
  let service: UserApplianceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserApplianceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
