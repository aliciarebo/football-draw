import { inject, Injectable} from '@angular/core';
import { LoginCredentials, LoginResponse, User, UserCreationRequest} from '../../features/home/models/user-prediction.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/users';

  createUser(user: UserCreationRequest): Observable<User>{
    return this.http.post<User>(this.apiUrl, user);
  }
  
  login(credential: LoginCredentials): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(this.apiUrl + '/login', credential);
  }

  refreshToken(refreshToken:string): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(this.apiUrl + '/refresh', {refreshToken});
  }

  getUsers():Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User>{
    return this.http.get<User>(this.apiUrl + '/' + id);
  }

}
