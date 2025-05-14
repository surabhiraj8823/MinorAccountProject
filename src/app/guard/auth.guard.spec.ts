import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (route, state) => 
      TestBed.runInInjectionContext(() => {
        const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
        const guard = new AuthGuard(mockRouter);
        return guard.canActivate(route, state);
      });

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
