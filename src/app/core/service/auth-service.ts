import { computed, Injectable, signal } from '@angular/core';
import { LoginCredentials, User, UserRole } from '../../features/home/models/user-prediction.model';
  export interface MockUser {
  id: string;
  userName: string;
  password: string;
  role: UserRole;
}
export const USERS: MockUser[] = [
  {
    id: '1',
    userName: 'Alicia',
    password: '1234',
    role: 'ADMIN'
  },
  {
    id: '2',
    userName: 'Javi',
    password: '1234',
    role: 'USER'
  }
];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'current-user';
  private readonly currentUserState  = signal<User|null>(this.loadCurrentUser());
  readonly currentUser = this.currentUserState.asReadonly();
  readonly isAuthenticated = computed(()=> this.currentUserState() !== null)




  login(credential: LoginCredentials): boolean{
    const currentUser = USERS.find((user)=> user.password === credential.password && user.userName === credential.userName);
    
    if(!currentUser){
      return false;
    }

    const user: User = {
      id: currentUser.id,
      userName: currentUser.userName,
      role: currentUser.role
    };

   this.currentUserState.set(user);

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(user)
    );

    return true;
  }

  logout(): void {
    this.currentUserState.set(null);
    localStorage.removeItem(this.storageKey);
  }

  private loadCurrentUser(): User | null {
    const savedUser = localStorage.getItem(
      this.storageKey
    );

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
