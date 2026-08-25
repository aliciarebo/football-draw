import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SeasonResultsRequest, SeasonResultsResponse } from "../models/season-result.model";
import { environment } from "../../../../environment/environment";


@Injectable({
  providedIn: 'root',
})
export class SeasonResultService{
  private readonly http = inject(HttpClient);

  private readonly apiUrl =  environment.apiUrl + '/seasonresult';;

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