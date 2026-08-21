import { inject, Injectable, signal } from "@angular/core";
import { PredictionService } from "../service/prediction.service";
import { UserPrediction } from "../../home/models/user-prediction.model";
import { mapSeasonPredictionToRequest } from "../mappers/season-prediction.mapper";
import { mapUserPredictionResponse } from "../mappers/user-prediction.mapper";
import { SeasonPrediction } from "../models/season-prediction.model";
import { Notification } from "../../../core/service/notification.service";
import { finalize } from "rxjs";

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

    obtainUserPrediction(): void{
        this.loadingUserPredictionState.set(true);
        this.predictionService.getCurrentUserPrediction()
        .pipe(
            finalize(() => {
                this.loadingUserPredictionState.set(false);
            })
        )
        .subscribe((response)=> {
        if (!response) {
            this.userPredictionState.set(null);
            return;
        }

        const prediction = mapUserPredictionResponse(response);

        this.userPredictionState.set(prediction);
        })
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
        this.predictionService.getPredictions()
        .pipe(
            finalize(() => {
                this.loadingPredictionsState.set(false);
            })
        )
        .subscribe({
            next: (response) => {
                const predictions =
                response.map((res) => mapUserPredictionResponse(res));

                this.usersPredictionsState.set(predictions);
            },
            error: () => {
                this.notificationService.errorMessage(
                'Error',
                'No se pudieron cargar las predicciones.'
                );
            }
    })
    }

    createPrediction(prediction: SeasonPrediction): void {
        this.savingPredictionState.set(true);
        
        const request = mapSeasonPredictionToRequest(prediction);
        
        this.predictionService.saveCurrentPrediction(request)
        .pipe(
            finalize(() => {
                this.savingPredictionState.set(false);
            })
        )
        .subscribe( {
            next: (response) => {
                if(!response){
                    return;
                }
                const prediction = mapUserPredictionResponse(response);
                this.userPredictionState.set(prediction);

                this.notificationService.successMessage(
                    'Porra guardada',
                    'Tus predicciones se han guardado correctamente.'
                );
            },
            error: () => {
                this.notificationService.errorMessage(
                    'Error',
                    'No se pudieron guardar tus predicciones.'
                );
            }
        });
    }

    updatePrediction(prediction: SeasonPrediction): void {
        this.savingPredictionState.set(true);
        const request = mapSeasonPredictionToRequest(prediction);
        this.predictionService.updateCurrentPrediction(request)
        .pipe(
            finalize(() => {
                this.savingPredictionState.set(false);
            })
        )
        .subscribe({
            next: (response) =>{
                const updatedPrediction = mapUserPredictionResponse(response);
                this.userPredictionState.set(updatedPrediction);

                this.notificationService.successMessage(
                    'Porra actualizada',
                    'Tus cambios se han guardado correctamente.'
                );
            },
            error: ()=>{
                this.notificationService.errorMessage(
                    'Error',
                    'No se pudieron guardar tus cambios.'
                );
            }
    });
    }
}