import { Component, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { Team } from '../../models/team-model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Player } from '../../models/player.model';
import { ButtonModule } from 'primeng/button';
import { SeasonPrediction } from '../../models/season-prediction.model';
import { MessageService } from 'primeng/api';
import { ToastModule, Toast } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { CompetitionTeamsResponse, FootballApiTeam } from '../../../../core/models/football-api-team.model';
import { SUPER_COPA_TEAMS } from '../../../../core/data/super-copa-teams.data';


@Component({
  selector: 'app-season-prediction-form-component',
  imports: [SelectModule, ReactiveFormsModule, ButtonModule, Toast, MessageModule],
  providers: [MessageService, ToastModule],
  templateUrl: './season-prediction-form-component.html',
  styleUrl: './season-prediction-form-component.css',
})
export class SeasonPredictionFormComponent implements OnChanges {
  
  @Output() seasonPrediction = new EventEmitter<SeasonPrediction>();
  @Input() laLigaTeams: Team[] = [];
  @Input()championsLeagueTeams: Team[] = []
  @Input() laLigaPlayers: Player[] = []
  @Input()goalKeepers: Player[] = [];
  @Input()ballonDorPlayers: Player[] = [];
  @Input()initialPrediction: SeasonPrediction |null = null;
  readonly superCopaTeams = SUPER_COPA_TEAMS;
  @Output() searchPlayer = new EventEmitter<string>();
  private messageService = inject(MessageService);
  formSubmitted = false;

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes['initialPrediction'] && this.initialPrediction){
      this.seasonPredictionForm.patchValue({
        laLigaWinner: this.initialPrediction.laLigaWinner,
        championsWinner:
          this.initialPrediction.championsLeagueWinner,
        copaReyWinner:
          this.initialPrediction.copaReyWinner,
        superCopaWinner:
          this.initialPrediction.superCopaWinner,
        topScorer:
          this.initialPrediction.topScorer,
        standOutPlayer:
          this.initialPrediction.standOutPlayer,
        disappointmentPlayer:
          this.initialPrediction.disappointmentPlayer,
        ballondOr:
          this.initialPrediction.ballondOr,
        goldenBoot:
          this.initialPrediction.goldenBoot,
        zamoraWinner:
          this.initialPrediction.zamoraWinner
      });
    }
  }

  seasonPredictionForm = new FormGroup({
    laLigaWinner: new FormControl<Team| null>(null, { validators: Validators.required}),
    championsWinner: new FormControl<Team| null>(null, { validators: Validators.required}),
    copaReyWinner: new FormControl<Team| null>(null, { validators: Validators.required}),
    superCopaWinner: new FormControl<Team| null>(null, { validators: Validators.required}),
    topScorer: new FormControl<Player|null>(null, {validators: Validators.required}),
    standOutPlayer: new FormControl<Player|null>(null, { validators: Validators.required}),
    disappointmentPlayer: new FormControl<Player|null>(null, { validators: Validators.required}),
    ballondOr: new FormControl<Player|null>(null, { validators: Validators.required}),
    goldenBoot: new FormControl<Player|null>(null, { validators: Validators.required}),
    zamoraWinner: new FormControl<Player|null>(null, { validators: Validators.required}),
  })


  savePrediction(){
    this.formSubmitted = true;
    this.seasonPredictionForm.markAllAsTouched();

    if (this.seasonPredictionForm.invalid) {
      return;
    }

    const value = this.seasonPredictionForm.getRawValue();

    if (
      !value.laLigaWinner ||
      !value.championsWinner ||
      !value.copaReyWinner ||
      !value.superCopaWinner ||
      !value.topScorer ||
      !value.standOutPlayer ||
      !value.disappointmentPlayer ||
      !value.ballondOr ||
      !value.goldenBoot ||
      !value.zamoraWinner
    ) {
      return;
    }

    const prediction: SeasonPrediction = {
      laLigaWinner: value.laLigaWinner,
      championsLeagueWinner: value.championsWinner,
      copaReyWinner: value.copaReyWinner,
      superCopaWinner: value.superCopaWinner,
      topScorer: value.topScorer,
      standOutPlayer: value.standOutPlayer,
      disappointmentPlayer: value.disappointmentPlayer,
      ballondOr: value.ballondOr,
      goldenBoot: value.goldenBoot,
      zamoraWinner: value.zamoraWinner
    };

    this.messageService.add({ severity: 'contrast', summary: 'Predicción enviada con éxito', detail: 'Tus predicciones se han guardado correctamente ' });
    console.log(prediction)
    this.seasonPrediction.emit(prediction);
  }
}
