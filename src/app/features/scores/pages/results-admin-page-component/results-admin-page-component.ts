import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SeasonResultsFormComponent } from "../../components/season-results-form-component/season-results-form-component";
import { FootballService } from '../../../../core/service/football-api.service';
import { PlayerService } from '../../../../core/service/football-players-api.service';
import { Player } from '../../../predictions/models/player.model';
import { Team } from '../../../predictions/models/team-model';
import { catchError, EMPTY } from 'rxjs';
import { SeasonResults } from '../../models/season-result.model';
import { ScoresService } from '../../service/scores.service';
import { PredictionOptionsFacade } from '../../../predictions/facade/prediction-options.facade';

@Component({
  selector: 'app-results-admin-page-component',
  imports: [SeasonResultsFormComponent],
  templateUrl: './results-admin-page-component.html',
  styleUrl: './results-admin-page-component.css',
})
export class ResultsAdminPageComponent implements OnInit{

  scoresService = inject(ScoresService);
  readonly optionsFacade = inject(PredictionOptionsFacade);

  ngOnInit(): void {
    this.optionsFacade.loadOptions();
  }


  saveSeasonResult(result: SeasonResults){
    this.scoresService.updateResults(result);

  }
}
