import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SeasonResultsRequest, SeasonResultsResponse } from "../models/season-result.model";

@Injectable({
  providedIn: 'root',
})
export class SeasonResultService{
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://localhost:7106/api/seasonresult';

  getSeasonResults() {
    return this.http.get<SeasonResultsResponse | null>(
      this.apiUrl
    );
  }

  createSeasonResults(request: SeasonResultsRequest) {
    return this.http.post<SeasonResultsResponse>(
      this.apiUrl,
      request
    );
  }

  updateSeasonResults(request: SeasonResultsRequest) {
    return this.http.put<SeasonResultsResponse>(
      this.apiUrl,
      request
    );
  }
}