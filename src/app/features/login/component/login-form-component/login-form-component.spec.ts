import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginFormComponent } from './login-form-component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with invalid login form', () => {
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should not emit login credentials when login form is invalid', () => {
    const emitSpy = vi.spyOn(component.loginCredentials, 'emit');

    component.login();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.loginForm.controls.loginUserName.touched).toBe(true);
    expect(component.loginForm.controls.loginPassword.touched).toBe(true);
  });

  it('should emit login credentials when login form is valid', () => {
    const emitSpy = vi.spyOn(component.loginCredentials, 'emit');

    component.loginForm.setValue({
      loginUserName: 'UserA',
      loginPassword: '1234',
    });

    component.login();

    expect(emitSpy).toHaveBeenCalledWith({
      userName: 'UserA',
      password: '1234',
    });
  });

  it('should not emit user registration when register form is invalid', () => {
    const emitSpy = vi.spyOn(component.userRegister, 'emit');

    component.createUser();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.createUserForm.controls.registerUserName.touched).toBe(true);
    expect(component.createUserForm.controls.registerPassword.touched).toBe(true);
  });

  it('should emit user registration when register form is valid', () => {
    const emitSpy = vi.spyOn(component.userRegister, 'emit');

    component.createUserForm.setValue({
      registerUserName: 'User B',
      registerPassword: '1234',
    });

    component.createUser();

    expect(emitSpy).toHaveBeenCalledWith({
      userName: 'User B',
      password: '1234',
    });
  });

  it('should show register form and reset login form', () => {
    component.loginForm.setValue({
      loginUserName: 'UserA',
      loginPassword: '1234',
    });

    component.showRegisterForm();

    expect(component.hasUser()).toBe(false);
    expect(component.loginForm.controls.loginUserName.value).toBe('');
    expect(component.loginForm.controls.loginPassword.value).toBe('');
  });

  it('should show login form and reset register form', () => {
    component.createUserForm.setValue({
      registerUserName: 'User B',
      registerPassword: '1234',
    });

    component.hasUser.set(false);

    component.showLoginForm();

    expect(component.hasUser()).toBe(true);
    expect(component.createUserForm.controls.registerUserName.value).toBe('');
    expect(component.createUserForm.controls.registerPassword.value).toBe('');
  });

  it('should show login form when hasUser is true', () => {
    component.hasUser.set(true);

    fixture.detectChanges();

    const heading: HTMLHeadingElement = fixture.nativeElement.querySelector('h2');

    expect(heading.textContent).toContain('Iniciar sesión');
  });
  it('should show register form when hasUser is false', () => {
    component.hasUser.set(false);

    fixture.detectChanges();

    const heading: HTMLHeadingElement = fixture.nativeElement.querySelector('h2');

    expect(heading.textContent).toContain('Crear cuenta');
  });
});
