import { inject, Injectable, signal } from "@angular/core";
import { AuthService } from "../service/auth-service";
import { LoginCredentials, LoginResponse, User, UserCreationRequest } from "../../features/home/models/user-prediction.model";
import { Notification } from "../service/notification.service";
import { Router } from "@angular/router";
import { finalize } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private readonly authService = inject(AuthService);

  private readonly notificationService = inject(Notification);

  private readonly router = inject(Router);
  
  private readonly currentUserState = signal<User|null>(this.loadUser());
  readonly currentUser = this.currentUserState.asReadonly();

  private readonly isAuthenticatedState = signal<boolean>(!!localStorage.getItem('token'));
  readonly isAuthenticated = this.isAuthenticatedState.asReadonly();

  private readonly loggingInState = signal(false);
  readonly loggingIn = this.loggingInState.asReadonly();

  private readonly registeringState = signal(false);
  readonly registering = this.registeringState.asReadonly();

  login(credential: LoginCredentials): void {
    this.loggingInState.set(true);
    this.authService.login(credential)
      .pipe(
        finalize(() => {
          this.loggingInState.set(false);
        })
      )
      .subscribe( {
        next: (response) => {
          this.saveSession(response);

          this.notificationService.successMessage(
            'Sesión iniciada',
            `Bienvenido, ${response.user.userName}.`
          );
          this.router.navigate(['/']);
        },
        error: () => {
          this.notificationService.errorMessage(
            'Error al iniciar sesión',
            'Usuario o contraseña incorrectos.'
          );
        }
      });
  }

  refreshToken(refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  saveSession(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));

    this.currentUserState.set(response.user);
    this.isAuthenticatedState.set(true);
  }

  createUser(user: UserCreationRequest): void {
    this.registeringState.set(true);
    this.authService.createUser(user)
    .pipe(
      finalize(() => {
        this.registeringState.set(false);
      })
    )
    .subscribe({
      next:()=>{
        this.notificationService.successMessage('Usuario creado', 'El usuario se ha creado correctamente')
      },
      error: ()=>{
        this.notificationService.errorMessage('Error', 'No se pudo crear el usuario')
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');

    this.isAuthenticatedState.set(false);
    this.currentUserState.set(null);
  }

  private loadUser(): User | null {
    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }
    
}