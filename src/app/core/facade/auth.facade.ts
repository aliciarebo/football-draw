import { inject, Injectable, signal } from "@angular/core";
import { AuthService } from "../service/auth-service";
import { LoginCredentials, LoginResponse, User, UserCreationRequest } from "../../features/home/models/user-prediction.model";

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private readonly authService = inject(AuthService);
  
  private readonly currentUserState = signal<User|null>(this.loadUser());
  readonly currentUser = this.currentUserState.asReadonly();

  private readonly isAuthenticatedState = signal<boolean>(!!localStorage.getItem('token'));
  readonly isAuthenticated = this.isAuthenticatedState.asReadonly();

  login(credential: LoginCredentials): void {
    this.authService.login(credential)
      .subscribe((response) => {
        this.saveSession(response);
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
    this.authService.createUser(user)
    .subscribe();
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