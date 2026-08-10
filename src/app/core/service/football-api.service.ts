import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CompetitionTeamsResponse, FootballApiTeam } from "../models/football-api-team.model";
import { environment } from "../../../environment/environment.development";

@Injectable({
  providedIn: 'root',
})
export class FootballService{
    http = inject(HttpClient);

    getLaLigaTeams(): Observable<FootballApiTeam[]>{
        return this.http.get<FootballApiTeam[]>('data/la-liga-teams.json');
    }

    getChampionsLeagueTeams(): Observable<FootballApiTeam[]>{
        return this.http.get<FootballApiTeam[]>('data/champions-league-teams.json')
    }
}