import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { signal } from '@angular/core';

import { authGuard } from './auth-guard';
import { AuthFacade } from '../facade/auth.facade';

describe('authGuard', () => {
  const isAuthenticated = signal(false);

  const authFacadeMock = {
    isAuthenticated,
  };

  const routerMock = {
    createUrlTree: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    isAuthenticated.set(false);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthFacade,
          useValue: authFacadeMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    });
  });

  it('should allow access when user is authenticated', () => {
    isAuthenticated.set(true);

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(result).toBe(true);
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    const loginUrlTree = {} as UrlTree;

    routerMock.createUrlTree.mockReturnValue(loginUrlTree);

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(loginUrlTree);
  });
});
