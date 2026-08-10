import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginCredentials, User } from '../../../home/models/user-prediction.model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';




@Component({
  selector: 'app-login-form-component',
  imports: [ReactiveFormsModule,InputTextModule,ButtonModule ],
  templateUrl: './login-form-component.html',
  styleUrl: './login-form-component.css',
})
export class LoginFormComponent {
  @Output() loginCredentials = new EventEmitter<LoginCredentials>();
  
  loginForm = new FormGroup({
    userName: new FormControl<string>('', {nonNullable: true, validators: Validators.required}),
    password: new FormControl<string>('', {nonNullable: true, validators: Validators.required})
  })

  login(){

    this.loginForm.markAllAsTouched();
    if(this.loginForm.invalid){
      return;
    }

    const user: LoginCredentials = {
      userName: this.loginForm.controls.userName.value,
      password: this.loginForm.controls.password.value
    };
    this.loginCredentials.emit(user);

  }

  
}
