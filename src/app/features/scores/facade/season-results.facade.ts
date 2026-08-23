import { inject, Injectable, signal } from "@angular/core";
import { SeasonResults } from "../models/season-result.model";
import { SeasonResultService } from "../service/season-results.service";
import { catchError, finalize, tap, throwError } from "rxjs";
import { mapSeasonResultsResponse, mapSeasonResultsToRequest } from "../mappers/season-results.mapper";

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

    createSeasonResults(result: SeasonResults) {
      this.savingResultsState.set(true);

      const request = mapSeasonResultsToRequest(result);

      return this.seasonResultService.createSeasonResults(request).pipe(
        tap((response) => {
          const mappedResult = mapSeasonResultsResponse(response);

          this.seasonResultsState.set(mappedResult);
        }),
        catchError((error) => {
          return throwError(() => error);
        }),
        finalize(() => {
          this.savingResultsState.set(false);
        })
      );
    }

    updateSeasonResults(result: SeasonResults) {
      this.savingResultsState.set(true);

      const request = mapSeasonResultsToRequest(result);

      return this.seasonResultService.updateSeasonResults(request).pipe(
        tap((response) => {
          const mappedResult = mapSeasonResultsResponse(response);

          this.seasonResultsState.set(mappedResult);
        }),
        catchError((error) => {
          return throwError(() => error);
        }),
        finalize(() => {
          this.savingResultsState.set(false);
        })
      );
    }
}

