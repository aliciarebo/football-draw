import { inject, Injectable, signal } from "@angular/core";
import { PredictionService } from "../service/prediction.service";
import { UserPrediction } from "../../home/models/user-prediction.model";
import { mapSeasonPredictionToRequest } from "../mappers/season-prediction.mapper";
import { mapUserPredictionResponse } from "../mappers/user-prediction.mapper";
import { SeasonPrediction } from "../models/season-prediction.model";
import { Notification } from "../../../core/service/notification.service";
import { catchError, finalize, tap, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PredictionFacade {
    private readonly predictionService = inject(PredictionService);

    private readonly notificationService = inject(Notification);
    
    private readonly userPredictionState = signal<UserPrediction|null>(null);
    readonly userPrediction = this.userPredictionState.asReadonly();

    private readonly userPredictionByIdState = signal<UserPrediction|null>(null);
    readonly userPredictionById = this.userPredictionByIdState.asReadonly();

    private readonly usersPredictionsState = signal<UserPrediction[]>([]);
    readonly usersPredictions = this.usersPredictionsState.asReadonly();

    private readonly loadingPredictionsState = signal(false);
    readonly loadingPredictions = this.loadingPredictionsState.asReadonly();

    private readonly loadingUserPredictionState = signal(false);
    readonly loadingUserPrediction = this.loadingUserPredictionState.asReadonly();

    private readonly savingPredictionState = signal(false);
    readonly savingPrediction = this.savingPredictionState.asReadonly();

    private readonly userPredictionErrorState = signal<string | null>(null);
    readonly userPredictionError = this.userPredictionErrorState.asReadonly();

    private readonly predictionsErrorState = signal<string | null>(null);
    readonly predictionsError = this.predictionsErrorState.asReadonly();

    obtainUserPrediction(): void{
        this.loadingUserPredictionState.set(true);
        this.userPredictionErrorState.set(null);
        this.predictionService.getCurrentUserPrediction()
        .pipe(
            finalize(() => {
                this.loadingUserPredictionState.set(false);
            })
        )
        .subscribe({
            next: (response) => {
                if (!response) {
                    this.userPredictionState.set(null);
                    return;
                }

                this.userPredictionState.set(mapUserPredictionResponse(response));
            },

            error: (error: HttpErrorResponse) => {
                if (error.status === 404) {
                    this.userPredictionState.set(null);
                    return;
                }
                if (error.status === 0) {
                    this.userPredictionErrorState.set('No se pudo conectar con el servidor.');
                    return;
                }

                this.userPredictionErrorState.set('No se pudo cargar tu porra.');
            }
    });
    }

    obtainUserPredictionById(userId:number):void{
        this.loadingUserPredictionState.set(true);
        this.predictionService.getUserPredictionById(userId)
        .pipe(
            finalize(() => {
                this.loadingUserPredictionState.set(false);
            })
        )
        .subscribe((response) => {
        if (!response) {
            this.userPredictionByIdState.set(null);
            return;
        }

        const prediction = mapUserPredictionResponse(response);

        this.userPredictionByIdState.set(prediction);
        })
    }

    obtainPredictions(): void {
        this.loadingPredictionsState.set(true);
        this.predictionsErrorState.set(null);

        this.predictionService.getPredictions()
            .pipe(
            finalize(() => {
                this.loadingPredictionsState.set(false);
            })
            )
            .subscribe({
            next: (response) => {
                const predictions = response.map((res) => mapUserPredictionResponse(res));
                this.usersPredictionsState.set(predictions);
            },

            error: (error: HttpErrorResponse) => {
                if (error.status === 0) {
                    this.predictionsErrorState.set('No se pudo conectar con el servidor.');
                    return;
                }

                this.predictionsErrorState.set('No se pudieron cargar las predicciones.');
            }
            });
    }

    createPrediction(prediction: SeasonPrediction) {
    this.savingPredictionState.set(true);

    const request = mapSeasonPredictionToRequest(prediction);

    return this.predictionService.saveCurrentPrediction(request)
    .pipe(
        tap((response) => {
            if (!response) {
                return;
            }
            const newPrediction = mapUserPredictionResponse(response);
            this.userPredictionState.set(newPrediction);

            this.notificationService.successMessage(
                'Porra guardada',
                'Tus predicciones se han guardado correctamente.'
            );
        }),
        catchError((error) => {
            this.notificationService.errorMessage(
                'Error',
                'No se pudieron guardar tus predicciones.'
            );

            return throwError(() => error);
        }),
        finalize(() => {
            this.savingPredictionState.set(false);
        })
    );
    }

    updatePrediction(prediction: SeasonPrediction) {
        this.savingPredictionState.set(true);

        const request = mapSeasonPredictionToRequest(prediction);

        return this.predictionService.updateCurrentPrediction(request)
        .pipe(
            tap((response) => {
                const updatedPrediction = mapUserPredictionResponse(response);

                this.userPredictionState.set(updatedPrediction);

                this.notificationService.successMessage(
                    'Porra actualizada',
                    'Tus cambios se han guardado correctamente.'
                );
            }),
            catchError((error) => {
                this.notificationService.errorMessage(
                    'Error',
                    'No se pudieron guardar tus cambios.'
                );

                return throwError(() => error);
            }),
            finalize(() => {
                this.savingPredictionState.set(false);
            })
        );
        
    }
}