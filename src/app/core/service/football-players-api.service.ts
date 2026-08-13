import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment.development';
import { FootballApiPlayer, PlayersApiResponse } from '../models/football-api-player.model';
import { Player } from '../../features/predictions/models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private readonly http = inject(HttpClient);

  getLaLigaPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(
      'data/la-liga-players.json'
    );
  }

  getBallonDorPlayers(): Observable<Player[]>{
    return this.http.get<Player[]>(
      'data/ballon-dor-players.json'
    );
  }
}