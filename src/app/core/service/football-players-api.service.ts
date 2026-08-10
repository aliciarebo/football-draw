import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment.development';
import { FootballApiPlayer, PlayersApiResponse } from '../models/football-api-player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private readonly http = inject(HttpClient);

  getLaLigaPlayers(): Observable<FootballApiPlayer[]> {
    return this.http.get<FootballApiPlayer[]>(
      'data/la-liga-players.json'
    );
  }

  getBallonDorPlayers(): Observable<FootballApiPlayer[]>{
    return this.http.get<FootballApiPlayer[]>(
      'data/ballon-dor-players.json'
    );
  }
}