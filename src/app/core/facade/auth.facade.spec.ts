import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthFacade } from './auth.facade';
import { AuthService } from '../service/auth-service';
import { Notification } from '../service/notification.service';
import {
  LoginCredentials,
  LoginResponse,
  UserCreationRequest,
} from '../../features/home/models/user-prediction.model';

describe('AuthFacade', () => {
  let facade: AuthFacade;

  const authServiceMock = {
    login: vi.fn(),
    refreshToken: vi.fn(),
    createUser: vi.fn(),
  };

  const notificationMock = {
    successMessage: vi.fn(),
    errorMessage: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  const credentials: LoginCredentials = {
    userName: 'User A',
    password: '1234',
  };

  const loginResponse: LoginResponse = {
    user: {
      id: 1,
      userName: 'User A',
      role: 'USER',
    },
    token: 'access-token',
    refreshToken: 'refresh-token',
  };

  const userRequest: UserCreationRequest = {
    userName: 'User B',
    password: '1234',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: Notification,
          useValue: notificationMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    });

    facade = TestBed.inject(AuthFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and save session', () => {
      authServiceMock.login.mockReturnValue(of(loginResponse));

      facade.login(credentials);

      expect(authServiceMock.login).toHaveBeenCalledWith(credentials);

      expect(localStorage.getItem('token')).toBe('access-token');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(loginResponse.user));

      expect(facade.currentUser()).toEqual(loginResponse.user);
      expect(facade.isAuthenticated()).toBe(true);

      expect(notificationMock.successMessage).toHaveBeenCalledWith(
        'Sesión iniciada',
        'Bienvenido, User A.',
      );

      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      expect(facade.loggingIn()).toBe(false);
    });

    it('should show connection error when login fails with status 0', () => {
      authServiceMock.login.mockReturnValue(
        throwError(() => ({
          status: 0,
        })),
      );

      facade.login(credentials);

      expect(notificationMock.errorMessage).toHaveBeenCalledWith(
        'Error de conexión',
        'No se pudo conectar con el servidor.',
      );

      expect(facade.loggingIn()).toBe(false);
    });

    it('should show credentials error when login fails with status 401', () => {
      authServiceMock.login.mockReturnValue(
        throwError(() => ({
          status: 401,
        })),
      );

      facade.login(credentials);

      expect(notificationMock.errorMessage).toHaveBeenCalledWith(
        'Error al iniciar sesión',
        'Usuario o contraseña incorrectos.',
      );

      expect(facade.loggingIn()).toBe(false);
    });

    it('should show server error when login fails with status 500', () => {
      authServiceMock.login.mockReturnValue(
        throwError(() => ({
          status: 500,
        })),
      );

      facade.login(credentials);

      expect(notificationMock.errorMessage).toHaveBeenCalledWith(
        'Error del servidor',
        'Ha ocurrido un problema al iniciar sesión.',
      );

      expect(facade.loggingIn()).toBe(false);
    });

    it('should show generic error when login fails with another status', () => {
      authServiceMock.login.mockReturnValue(
        throwError(() => ({
          status: 400,
        })),
      );

      facade.login(credentials);

      expect(notificationMock.errorMessage).toHaveBeenCalledWith(
        'Error',
        'No se pudo iniciar sesión.',
      );

      expect(facade.loggingIn()).toBe(false);
    });
  });

  describe('saveSession', () => {
    it('should store session and update auth state', () => {
      facade.saveSession(loginResponse);

      expect(localStorage.getItem('token')).toBe('access-token');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(loginResponse.user));

      expect(facade.currentUser()).toEqual(loginResponse.user);
      expect(facade.isAuthenticated()).toBe(true);
    });
  });

  describe('createUser', () => {
    it('should create user successfully', () => {
      authServiceMock.createUser.mockReturnValue(of(null));

      facade.createUser(userRequest);

      expect(authServiceMock.createUser).toHaveBeenCalledWith(userRequest);

      expect(notificationMock.successMessage).toHaveBeenCalledWith(
        'Usuario creado',
        'El usuario se ha creado correctamente',
      );

      expect(facade.registering()).toBe(false);
    });

    it('should show error when user creation fails', () => {
      authServiceMock.createUser.mockReturnValue(throwError(() => new Error('Register failed')));

      facade.createUser(userRequest);

      expect(notificationMock.errorMessage).toHaveBeenCalledWith(
        'Error',
        'No se pudo crear el usuario',
      );

      expect(facade.registering()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear session and auth state', () => {
      facade.saveSession(loginResponse);

      facade.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();

      expect(facade.currentUser()).toBeNull();
      expect(facade.isAuthenticated()).toBe(false);
    });
  });

  describe('refreshToken', () => {
    it('should delegate refresh token to AuthService', () => {
      const response$ = of(loginResponse);

      authServiceMock.refreshToken.mockReturnValue(response$);

      const result = facade.refreshToken('refresh-token');

      expect(authServiceMock.refreshToken).toHaveBeenCalledWith('refresh-token');

      expect(result).toBe(response$);
    });
  });
});
