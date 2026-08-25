import {inject, Injectable} from '@angular/core';
import { UserPredictionResponse } from '../../home/models/user-prediction.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateSeasonPredictionRequest } from '../models/create-season-prediction-request.model';
import { environment } from '../../../../environment/environment';


@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/predictions';


  getPredictions(): Observable<UserPredictionResponse[]> {
    return this.http.get<UserPredictionResponse[]>(this.apiUrl );
  }
  getCurrentUserPrediction(): Observable<UserPredictionResponse | null> {
    return this.http.get<UserPredictionResponse|null>(this.apiUrl + '/me');
  }
  getUserPredictionById(userId:number): Observable<UserPredictionResponse | null>{
    return this.http.get<UserPredictionResponse|null>(this.apiUrl + '/user/' + userId)
  }

  saveCurrentPrediction(seasonPrediction: CreateSeasonPredictionRequest): Observable<UserPredictionResponse | null> {
   return this.http.post<UserPredictionResponse | null>(this.apiUrl, seasonPrediction)
  }

  updateCurrentPrediction(prediction: CreateSeasonPredictionRequest): Observable<UserPredictionResponse> {
    return this.http.put<UserPredictionResponse>(this.apiUrl, prediction );
  }
}
