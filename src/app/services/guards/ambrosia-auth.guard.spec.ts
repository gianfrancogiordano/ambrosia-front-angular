import { TestBed } from '@angular/core/testing';

import { AmbrosiaAuthGuard } from './ambrosia-auth.guard';

describe('AmbrosiaAuthGuard', () => {
  let guard: AmbrosiaAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AmbrosiaAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
