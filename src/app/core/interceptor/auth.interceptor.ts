import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';

import {
  catchError,
  finalize,
  Observable,
  shareReplay,
  switchMap,
  tap,
  throwError
} from 'rxjs';

import { AuthFacade } from '../facade/auth.facade';
import { LoginResponse } from '../../features/home/models/user-prediction.model';


let refreshRequest$: Observable<LoginResponse> | null = null;


export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authFacade = inject(AuthFacade);

  const isAuthRequest =
    req.url.includes('/users/login') ||
    req.url.includes('/users/refresh');

  if (isAuthRequest) {
    return next(req);
  }


  const token = localStorage.getItem('token');

  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;


  return next(authReq).pipe(

    catchError((error: HttpErrorResponse) => {

      if (error.status !== 401) {
        return throwError(() => error);
      }


      const refreshToken =
        localStorage.getItem('refreshToken');


      if (!refreshToken) {
        authFacade.logout();

        return throwError(() => error);
      }


      if (!refreshRequest$) {

        refreshRequest$ = authFacade
          .refreshToken(refreshToken)
          .pipe(

            tap((response) => {
              authFacade.saveSession(response);
            }),

            finalize(() => {
              refreshRequest$ = null;
            }),

            shareReplay(1)
          );
      }


      return refreshRequest$.pipe(

        switchMap((response) => {

          const retryRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.token}`
            }
          });

          return next(retryRequest);
        }),

        catchError((refreshError) => {

          authFacade.logout();

          return throwError(() => refreshError);
        })
      );

    })
  );
};