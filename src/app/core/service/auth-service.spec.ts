import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { AuthService } from './auth-service';
import { environment } from '../../../environment/environment';
import {
  LoginCredentials,
  LoginResponse,
  User,
  UserCreationRequest,
} from '../../features/home/models/user-prediction.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const apiUrl = environment.apiUrl + '/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create user', () => {
    const userRequest: UserCreationRequest = {
      userName: 'Alicia',
      password: '1234',
    };

    const userResponse: User = {
      id: 1,
      userName: 'Alicia',
      role: 'USER',
    };

    service.createUser(userRequest).subscribe((response) => {
      expect(response).toEqual(userResponse);
    });

    const req = httpMock.expectOne(apiUrl);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userRequest);

    req.flush(userResponse);
  });

  it('should login user', () => {
    const credentials: LoginCredentials = {
      userName: 'Alicia',
      password: '1234',
    };

    const loginResponse: LoginResponse = {
      user: {
        id: 1,
        userName: 'Alicia',
        role: 'USER',
      },
      token: 'access-token',
      refreshToken: 'refresh-token',
    };

    service.login(credentials).subscribe((response) => {
      expect(response).toEqual(loginResponse);
    });

    const req = httpMock.expectOne(apiUrl + '/login');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);

    req.flush(loginResponse);
  });

  it('should refresh token', () => {
    const refreshToken = 'refresh-token';

    const loginResponse: LoginResponse = {
      user: {
        id: 1,
        userName: 'Alicia',
        role: 'USER',
      },
      token: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    service.refreshToken(refreshToken).subscribe((response) => {
      expect(response).toEqual(loginResponse);
    });

    const req = httpMock.expectOne(apiUrl + '/refresh');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      refreshToken,
    });

    req.flush(loginResponse);
  });

  it('should get users', () => {
    const users: User[] = [
      {
        id: 1,
        userName: 'Alicia',
        role: 'USER',
      },
      {
        id: 2,
        userName: 'Admin',
        role: 'ADMIN',
      },
    ];

    service.getUsers().subscribe((response) => {
      expect(response).toEqual(users);
    });

    const req = httpMock.expectOne(apiUrl);

    expect(req.request.method).toBe('GET');

    req.flush(users);
  });

  it('should get user by id', () => {
    const user: User = {
      id: 1,
      userName: 'Alicia',
      role: 'USER',
    };

    service.getUserById(1).subscribe((response) => {
      expect(response).toEqual(user);
    });

    const req = httpMock.expectOne(apiUrl + '/1');

    expect(req.request.method).toBe('GET');

    req.flush(user);
  });
});
