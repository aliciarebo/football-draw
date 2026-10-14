import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authInterceptor } from './auth.interceptor';
import { AuthFacade } from '../facade/auth.facade';
import { LoginResponse } from '../../features/home/models/user-prediction.model';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const loginResponse: LoginResponse = {
    user: {
      id: 1,
      userName: 'User A',
      role: 'USER',
    },
    token: 'new-token',
    refreshToken: 'new-refresh-token',
  };

  const authFacadeMock = {
    refreshToken: vi.fn(),
    saveSession: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthFacade,
          useValue: authFacadeMock,
        },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not add token to login requests', () => {
    localStorage.setItem('token', 'token');

    http.post('/api/users/login', {}).subscribe();

    const req = httpMock.expectOne('/api/users/login');

    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({});
  });

  it('should not add token to refresh requests', () => {
    localStorage.setItem('token', 'token');

    http.post('/api/users/refresh', {}).subscribe();

    const req = httpMock.expectOne('/api/users/refresh');

    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({});
  });

  it('should add authorization header when token exists', () => {
    localStorage.setItem('token', 'access-token');

    http.get('/api/predictions').subscribe();

    const req = httpMock.expectOne('/api/predictions');

    expect(req.request.headers.get('Authorization')).toBe('Bearer access-token');

    req.flush({});
  });

  it('should send request without authorization header when token does not exist', () => {
    http.get('/api/predictions').subscribe();

    const req = httpMock.expectOne('/api/predictions');

    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({});
  });

  it('should propagate non-401 errors without refreshing token', () => {
    http.get('/api/predictions').subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('/api/predictions');

    req.flush(
      { message: 'Server error' },
      {
        status: 500,
        statusText: 'Server Error',
      },
    );

    expect(authFacadeMock.refreshToken).not.toHaveBeenCalled();
    expect(authFacadeMock.logout).not.toHaveBeenCalled();
  });

  it('should logout when response is 401 and there is no refresh token', () => {
    http.get('/api/predictions').subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
      },
    });

    const req = httpMock.expectOne('/api/predictions');

    req.flush(
      {},
      {
        status: 401,
        statusText: 'Unauthorized',
      },
    );

    expect(authFacadeMock.logout).toHaveBeenCalled();
    expect(authFacadeMock.refreshToken).not.toHaveBeenCalled();
  });

  it('should refresh token and retry request after 401', () => {
    localStorage.setItem('token', 'old-token');
    localStorage.setItem('refreshToken', 'refresh-token');

    authFacadeMock.refreshToken.mockReturnValue(of(loginResponse));

    http.get('/api/predictions').subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    const firstReq = httpMock.expectOne('/api/predictions');

    expect(firstReq.request.headers.get('Authorization')).toBe('Bearer old-token');

    firstReq.flush(
      {},
      {
        status: 401,
        statusText: 'Unauthorized',
      },
    );

    expect(authFacadeMock.refreshToken).toHaveBeenCalledWith('refresh-token');

    expect(authFacadeMock.saveSession).toHaveBeenCalledWith(loginResponse);

    const retryReq = httpMock.expectOne('/api/predictions');

    expect(retryReq.request.headers.get('Authorization')).toBe('Bearer new-token');

    retryReq.flush({ success: true });
  });

  it('should logout when refresh token request fails', () => {
    localStorage.setItem('token', 'old-token');
    localStorage.setItem('refreshToken', 'refresh-token');

    authFacadeMock.refreshToken.mockReturnValue(throwError(() => new Error('Refresh failed')));

    http.get('/api/predictions').subscribe({
      error: (error) => {
        expect(error.message).toBe('Refresh failed');
      },
    });

    const req = httpMock.expectOne('/api/predictions');

    req.flush(
      {},
      {
        status: 401,
        statusText: 'Unauthorized',
      },
    );

    expect(authFacadeMock.refreshToken).toHaveBeenCalledWith('refresh-token');

    expect(authFacadeMock.logout).toHaveBeenCalled();
  });
});
