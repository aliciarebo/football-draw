import { inject, Injectable, signal } from "@angular/core";
import { AuthService } from "../service/auth-service";
import { LoginCredentials, User, UserCreationRequest } from "../../features/home/models/user-prediction.model";

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
    .subscribe((response)=>{
       this.currentUserState.set(response.user);
       this.isAuthenticatedState.set(true);
       localStorage.setItem(
          'token',
          response.token
        );

        localStorage.setItem(
          'user',
          JSON.stringify(response.user)
        );
      })
  }

  createUser(user: UserCreationRequest): void {
    this.authService.createUser(user)
    .subscribe();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

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