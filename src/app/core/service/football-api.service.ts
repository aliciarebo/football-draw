import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CompetitionTeamsResponse, FootballApiTeam } from "../models/football-api-team.model";
import { environment } from "../../../environment/environment.development";
import { Team } from "../../features/predictions/models/team-model";

@Injectable({
  providedIn: 'root',
})
export class FootballService{
    http = inject(HttpClient);

    getLaLigaTeams(): Observable<Team[]>{
        return this.http.get<Team[]>('data/la-liga-teams.json');
    }

    getChampionsLeagueTeams(): Observable<Team[]>{
        return this.http.get<Team[]>('data/champions-league-teams.json')
    }
}