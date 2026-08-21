import { inject, Injectable, signal } from "@angular/core";
import { PredictionService } from "../service/prediction.service";
import { UserPrediction } from "../../home/models/user-prediction.model";
import { mapSeasonPredictionToRequest } from "../mappers/season-prediction.mapper";
import { mapUserPredictionResponse } from "../mappers/user-prediction.mapper";
import { SeasonPrediction } from "../models/season-prediction.model";
import { Notification } from "../../../core/service/notification.service";

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

    obtainUserPrediction(): void{
        this.predictionService.getCurrentUserPrediction()
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
        this.predictionService.getUserPredictionById(userId)
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
        this.predictionService.getPredictions()
        .subscribe((response)=>{
            const predictions = response.map((res)=> mapUserPredictionResponse(res));
            this.usersPredictionsState.set(predictions);
        })
    }

    createPrediction(prediction: SeasonPrediction): void {
        const request = mapSeasonPredictionToRequest(prediction);
        this.predictionService.saveCurrentPrediction(request)
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
        const request = mapSeasonPredictionToRequest(prediction);
        this.predictionService.updateCurrentPrediction(request)
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