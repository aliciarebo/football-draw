import { Component, inject, OnInit} from '@angular/core';
import { SeasonResultsFormComponent } from "../../components/season-results-form-component/season-results-form-component";
import { SeasonResults } from '../../models/season-result.model';
import { PredictionOptionsFacade } from '../../../predictions/facade/prediction-options.facade';
import { SeasonResultFacade } from '../../facade/season-results.facade';

@Component({
  selector: 'app-results-admin-page-component',
  imports: [SeasonResultsFormComponent],
  templateUrl: './results-admin-page-component.html',
  styleUrl: './results-admin-page-component.css',
})
export class ResultsAdminPageComponent implements OnInit{

  readonly optionsFacade = inject(PredictionOptionsFacade);
  readonly seasonResultFacade = inject(SeasonResultFacade);

  ngOnInit(): void {
    this.optionsFacade.loadOptions();
    this.seasonResultFacade.obtainSeasonResults();
  }

  saveSeasonResult(result: SeasonResults){
    const request$ = this.seasonResultFacade.seasonResults()
    ? this.seasonResultFacade.updateSeasonResults(result)
    : this.seasonResultFacade.createSeasonResults(result);

  request$.subscribe();
  }
}
