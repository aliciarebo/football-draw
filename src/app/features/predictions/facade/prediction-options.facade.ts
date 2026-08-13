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
            const laliga: Team[] = teams.map((apiTeam) => {
                return {
                id: apiTeam.id,
                clubName: apiTeam.name,
                shortName: apiTeam.tla
                };
            });

            this.laLigaTeamsState.set(laliga);
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
            const champions: Team[] = teams.map((team)=>{
                return{
                    id: team.id,
                    clubName: team.name,
                    shortName: team.tla
                };
            });

            this.championsTeamsState.set(champions);
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
            const laligaPlayers: Player[] = players.map((player)=>{
                return {
                    id: player.player_id,
                    name: player.player_name,
                    position: player.position,
                };
            });
            this.laLigaPlayersState.set(laligaPlayers);
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
            const ballonDorPlayers: Player[] = players.map((player)=>{
                return {
                    id: player.player_id,
                    name: player.player_name,
                    position: player.position
                };
            });

            this.ballonDorPlayersState.set(ballonDorPlayers)
        })
     }


}