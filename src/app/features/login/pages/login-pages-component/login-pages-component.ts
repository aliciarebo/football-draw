import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '../../../../core/facade/auth.facade';
import { LoginCredentials, UserCreationRequest } from '../../../home/models/user-prediction.model';
import { LoginFormComponent } from '../../component/login-form-component/login-form-component';

@Component({
  selector: 'app-login-pages-component',
  imports: [LoginFormComponent],
  templateUrl: './login-pages-component.html',
  styleUrl: './login-pages-component.css',
})
export class LoginPagesComponent {
  authFacade = inject(AuthFacade);
  readonly router = inject(Router);

  login(user: LoginCredentials) {
    this.authFacade.login(user);

    this.router.navigate(['/myPrediction']);
  }

  register(user: UserCreationRequest) {
    this.authFacade.createUser(user);
  }
}
