import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Team } from '../../../predictions/models/team-model';
import { Player } from '../../../predictions/models/player.model';
import { SeasonResults } from '../../models/season-result.model';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import { SUPER_COPA_TEAMS } from '../../../../core/data/super-copa-teams.data';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-season-results-form-component',
  imports: [ReactiveFormsModule, SelectModule, ButtonModule ],
  providers: [MessageService],
  templateUrl: './season-results-form-component.html',
  styleUrl: './season-results-form-component.css',
})
export class SeasonResultsFormComponent implements OnChanges{
  
  @Output() seasonResults = new EventEmitter<SeasonResults>();
  @Input() laLigaTeams: Team[] = [];
  @Input()championsLeagueTeams: Team[] = []
  @Input() laLigaPlayers: Player[] = []
  @Input()goalKeepers: Player[] = [];
  @Input()ballonDorPlayers: Player[] = [];
  @Input() initialResults: SeasonResults|null = null;
  readonly superCopaTeams = SUPER_COPA_TEAMS;


  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['initialResults'] &&
      this.initialResults
    ) {
      this.seasonResultsForm.patchValue(
        this.initialResults
      );
    }
  }
  seasonResultsForm = new FormGroup({
    laLigaWinner: new FormControl<Team |null>(null),
    championsLeagueWinner: new FormControl<Team |null>(null),
    copaReyWinner: new FormControl<Team |null>(null),
    superCopaWinner: new FormControl<Team |null>(null),
    topScorer: new FormControl<Player |null>(null),
    standOutPlayer: new FormControl<Player |null>(null),
    disappointmentPlayer: new FormControl<Player |null>(null),
    ballondOr: new FormControl<Player |null>(null),
    goldenBoot: new FormControl<Player |null>(null),
    zamoraWinner: new FormControl<Player |null>(null),
  });

  sendSeasonResult(){
    this.seasonResults.emit(this.seasonResultsForm.getRawValue());

  }
}
