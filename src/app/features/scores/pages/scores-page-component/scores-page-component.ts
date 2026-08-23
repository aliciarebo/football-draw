import { Component, computed, inject, OnInit} from '@angular/core';
import { ScoresService } from '../../service/scores.service';
import { ScoresTableComponent } from "../../components/scores-table-component/scores-table-component";
import { PredictionFacade } from '../../../predictions/facade/predictions.facade';
import { SeasonResultFacade } from '../../facade/season-results.facade';
import { ProgressSpinnerModule } from "primeng/progressspinner";

@Component({
  selector: 'app-scores-page-component',
  imports: [ScoresTableComponent, ProgressSpinnerModule],
  templateUrl: './scores-page-component.html',
  styleUrl: './scores-page-component.css',
})
export class ScoresPageComponent implements OnInit{
  readonly predictionFacade = inject(PredictionFacade);
  
  readonly seasonResultFacade = inject(SeasonResultFacade);

  readonly scoresService = inject(ScoresService);

  
  readonly scores = computed(() => {
    const results = this.seasonResultFacade.seasonResults();

    if (!results) {
      return [];
    }

    return this.scoresService.calculateScores(
      this.predictionFacade.usersPredictions(),
      results
    );
  });

  ngOnInit(): void {
    this.predictionFacade.obtainPredictions();
    this.seasonResultFacade.obtainSeasonResults();
  }
}
