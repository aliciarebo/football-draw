import { computed, inject, Injectable, signal } from "@angular/core";
import { PlayerService } from "../../../core/service/football-players-api.service";
import { FootballService } from "../../../core/service/football-api.service";
import { Team } from "../models/team-model";
import { Player } from "../models/player.model";
import { catchError, EMPTY } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PredictionOptionsFacade {
    private readonly playerService = inject(PlayerService);
    private readonly footballService = inject(FootballService);
    
    private readonly laLigaTeamsState = signal<Team[]>([]);
    readonly laLigaTeams = this.laLigaTeamsState.asReadonly();
    
    private readonly championsTeamsState = signal<Team[]>([]);
    readonly championsTeams = this.championsTeamsState.asReadonly();

    private readonly laLigaPlayersState = signal<Player[]>([]);
    readonly laLigaPlayers = this.laLigaPlayersState.asReadonly();

    private readonly ballonDorPlayersState = signal<Player[]>([]);
    readonly ballonDorPlayers = this.ballonDorPlayersState.asReadonly();

    readonly goalkeeperPlayers = computed(() =>
        this.laLigaPlayersState().filter(
        player => player.position === 'Goalkeeper'
        )
    );

    loadOptions(): void {

        if (this.laLigaTeams().length === 0) {
            this.obtainLaLigaTeams();
        }

        if (this.championsTeams().length === 0) {
            this.obtainChampionsLeagueTeams();
        }

        if (this.laLigaPlayers().length === 0) {
            this.obtainLaLigaPlayers();
        }

        if (this.ballonDorPlayers().length === 0) {
            this.obtainBallonDorPlayers();
        }
    }

    obtainLaLigaTeams(){
        this.footballService.getLaLigaTeams()
        .pipe(
              catchError(()=>{
                console.log('error')
                return EMPTY;
              }
              )
            )
        .subscribe((teams)=> {
            this.laLigaTeamsState.set(teams);
        })
    }

     obtainChampionsLeagueTeams(){
        this.footballService.getChampionsLeagueTeams()
        .pipe(
              catchError(()=>{
                console.log('error')
                return EMPTY;
              }
              )
            )
        .subscribe((teams)=>{
            this.championsTeamsState.set(teams);
        })
     }

     obtainLaLigaPlayers(){
        this.playerService.getLaLigaPlayers()
        .pipe(
              catchError(()=>{
                console.log('error')
                return EMPTY;
              }
              )
            )
        .subscribe((players)=>{
            this.laLigaPlayersState.set(players);
        })
     }

     obtainBallonDorPlayers(){
        this.playerService.getBallonDorPlayers()
        .pipe(
              catchError(()=>{
                console.log('error')
                return EMPTY;
              }
              )
            )
        .subscribe((players)=>{
            this.ballonDorPlayersState.set(players)
        })
     }


}