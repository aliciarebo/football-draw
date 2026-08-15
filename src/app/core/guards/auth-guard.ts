import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../service/auth-service';
import { AuthFacade } from '../facade/auth.facade';

export const authGuard: CanActivateFn = (route, state) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);
  if (authFacade.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
