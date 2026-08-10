import { Component, inject } from '@angular/core';
import { LoginFormComponent } from "../../component/login-form-component/login-form-component";
import { AuthService } from '../../../../core/service/auth-service';
import { LoginCredentials, User } from '../../../home/models/user-prediction.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-pages-component',
  imports: [LoginFormComponent],
  templateUrl: './login-pages-component.html',
  styleUrl: './login-pages-component.css',
})
export class LoginPagesComponent {
  loginService = inject(AuthService);
  readonly router = inject(Router);

  login(user: LoginCredentials){
    const loginSuccess = this.loginService.login(user);

    if (!loginSuccess) {
      return;
    }

    this.router.navigate(['/myPrediction']);

  }
}
