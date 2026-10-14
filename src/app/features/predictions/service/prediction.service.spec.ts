import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { PredictionService } from './prediction.service';
import { environment } from '../../../../environment/environment';
import { CreateSeasonPredictionRequest } from '../models/create-season-prediction-request.model';

describe('PredictionService', () => {
  let service: PredictionService;
  let httpController: HttpTestingController;

  const apiUrl = environment.apiUrl + '/predictions';

  const request: CreateSeasonPredictionRequest = {
    championsLeagueWinnerId: 2,
    championsLeagueWinnerName: 'Real Madrid',

    laLigaWinnerId: 15,
    laLigaWinnerName: 'FC Barcelona',

    copaReyWinnerId: 15,
    copaReyWinnerName: 'FC Barcelona',

    superCopaWinnerId: 2,
    superCopaWinnerName: 'Real Madrid',

    topScorerId: 10,
    topScorerName: 'Lamine Yamal',

    standOutPlayerId: 11,
    standOutPlayerName: 'Player A',

    disappointmentPlayerId: 12,
    disappointmentPlayerName: 'Player B',

    ballondOrId: 13,
    ballondOrName: 'Player C',

    goldenBootId: 14,
    goldenBootName: 'Player D',

    zamoraWinnerId: 15,
    zamoraWinnerName: 'Goalkeeper A',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PredictionService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PredictionService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all predictions', () => {
    service.getPredictions().subscribe();

    const req = httpController.expectOne(apiUrl);

    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('should get current user prediction', () => {
    service.getCurrentUserPrediction().subscribe();

    const req = httpController.expectOne(`${apiUrl}/me`);

    expect(req.request.method).toBe('GET');

    req.flush(null);
  });

  it('should get user prediction by id', () => {
    service.getUserPredictionById(2).subscribe();

    const req = httpController.expectOne(`${apiUrl}/user/2`);

    expect(req.request.method).toBe('GET');

    req.flush(null);
  });

  it('should save current prediction', () => {
    service.saveCurrentPrediction(request).subscribe();

    const req = httpController.expectOne(apiUrl);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush(null);
  });

  it('should update current prediction', () => {
    service.updateCurrentPrediction(request).subscribe();

    const req = httpController.expectOne(apiUrl);

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);

    req.flush({});
  });
});
