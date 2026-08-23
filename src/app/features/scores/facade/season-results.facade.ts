import { inject, Injectable, signal } from "@angular/core";
import { SeasonResults } from "../models/season-result.model";
import { SeasonResultService } from "../service/season-results.service";
import { finalize } from "rxjs";
import { mapSeasonResultsResponse } from "../mappers/season-results.mapper";

@Injectable({
  providedIn: 'root'
})
export class SeasonResultFacade {
    private readonly seasonResultService = inject(SeasonResultService);
    
    private readonly seasonResultsState = signal<SeasonResults | null>(null);
    readonly seasonResults = this.seasonResultsState.asReadonly();

    private readonly loadingResultsState = signal(false);
    readonly loadingResults = this.loadingResultsState.asReadonly();

    private readonly savingResultsState = signal(false);
    readonly savingResults = this.savingResultsState.asReadonly();

    obtainSeasonResults(): void {
        this.loadingResultsState.set(true);

        this.seasonResultService.getSeasonResults()
          .pipe(
            finalize(() => {
              this.loadingResultsState.set(false);
            })
          )
          .subscribe({
            next: (response) => {
              if (!response) {
                this.seasonResultsState.set(null);
                return;
              }

              const results = mapSeasonResultsResponse(response);

              this.seasonResultsState.set(results);
            },
            error: () => {
              this.seasonResultsState.set(null);
            }
          });
      }
}