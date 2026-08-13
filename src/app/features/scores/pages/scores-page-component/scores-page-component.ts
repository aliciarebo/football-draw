import { Component, computed, inject, Signal } from '@angular/core';
import { ScoresService } from '../../service/scores.service';
import { PredictionService } from '../../../predictions/service/prediction.service';
import { SeasonResults } from '../../models/season-result.model';
import { ScoresTableComponent } from "../../components/scores-table-component/scores-table-component";
import { PredictionFacade } from '../../../predictions/facade/predictions.facade';

@Component({
  selector: 'app-scores-page-component',
  imports: [ ScoresTableComponent],
  templateUrl: './scores-page-component.html',
  styleUrl: './scores-page-component.css',
})
export class ScoresPageComponent {
  private readonly predictionFacade = inject(PredictionFacade);

  private readonly scoresService = inject(ScoresService);

  private readonly realWinners:Signal<SeasonResults> = this.scoresService.seasonResult;
  
  readonly scores = computed(() => {
    return this.scoresService.calculateScores(
      this.predictionFacade.usersPredictions(),
      this.realWinners()
    );
  });
}
