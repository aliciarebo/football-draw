import { inject, Injectable} from '@angular/core';
import { LoginCredentials, LoginResponse, User, UserCreationRequest, UserRole } from '../../features/home/models/user-prediction.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://localhost:7106/api/users';

  createUser(user: UserCreationRequest): Observable<User>{
    return this.http.post<User>(this.apiUrl, user);
  }
  
  login(credential: LoginCredentials): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(this.apiUrl + '/login', credential);
  }

  getUsers():Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User>{
    return this.http.get<User>(this.apiUrl + '/' + id);
  }

}
