import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthFacade } from '../facade/auth.facade';

export const adminGuard: CanActivateFn = (route, state) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);
  if(authFacade.currentUser()?.role === 'ADMIN'){
    return true;
  }
  return router.createUrlTree(['/']);
};
