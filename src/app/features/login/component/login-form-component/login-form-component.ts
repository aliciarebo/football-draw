import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginCredentials, UserCreationRequest } from '../../../home/models/user-prediction.model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login-form-component',
  imports: [ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  CardModule,
  PasswordModule ],
  templateUrl: './login-form-component.html',
  styleUrl: './login-form-component.css',
})
export class LoginFormComponent {
  @Output() loginCredentials = new EventEmitter<LoginCredentials>();
  @Output() userRegister = new EventEmitter<UserCreationRequest>();
  hasUser = signal<boolean>(true);
  
  loginForm = new FormGroup({
    loginUserName: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
    loginPassword: new FormControl<string>('', {nonNullable: true, validators: Validators.required})
  })

  createUserForm = new FormGroup({
    registerUserName: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
    registerPassword: new FormControl<string>('', {nonNullable: true, validators: Validators.required})
  })

  login(){
    this.loginForm.markAllAsTouched();
    if(this.loginForm.invalid){
      return;
    }

    const user: LoginCredentials = {
      userName: this.loginForm.controls.loginUserName.value,
      password: this.loginForm.controls.loginPassword.value
    };
    this.loginCredentials.emit(user);

  }

  createUser(){
    this.createUserForm.markAllAsTouched();
    if(this.createUserForm.invalid){
      return;
    }
    const user: UserCreationRequest = {
      userName: this.createUserForm.controls.registerUserName.value,
      password: this.createUserForm.controls.registerPassword.value
    };

    this.userRegister.emit(user);
  }
  showRegisterForm(){
    this.loginForm.reset();
    this.hasUser.set(false);
  }

  showLoginForm(){
    this.createUserForm.reset();
    this.hasUser.set(true);
  }

  
}
