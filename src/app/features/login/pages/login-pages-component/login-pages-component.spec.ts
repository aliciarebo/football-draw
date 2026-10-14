import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginPagesComponent } from './login-pages-component';
import { AuthFacade } from '../../../../core/facade/auth.facade';

describe('LoginPagesComponent', () => {
  let component: LoginPagesComponent;
  let fixture: ComponentFixture<LoginPagesComponent>;

  const authFacadeMock = {
    loggingIn: signal(false),
    registering: signal(false),
    login: vi.fn(),
    createUser: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [LoginPagesComponent],
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
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPagesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login and navigate to my prediction', () => {
    const credentials = {
      userName: 'UserA',
      password: '1234',
    };

    component.login(credentials);

    expect(authFacadeMock.login).toHaveBeenCalledWith(credentials);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/myPrediction']);
  });

  it('should register user', () => {
    const user = {
      userName: 'UserA',
      password: '1234',
    };

    component.register(user);

    expect(authFacadeMock.createUser).toHaveBeenCalledWith(user);
  });
});
