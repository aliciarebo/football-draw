import { computed, inject, Injectable, signal } from '@angular/core';
import { SeasonPrediction } from '../models/season-prediction.model';
import { User, UserPrediction } from '../../home/models/user-prediction.model';
import { Password } from 'primeng/password';
import { AuthService } from '../../../core/service/auth-service';

@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  private readonly storageKey = 'user-predictions';
  authService = inject(AuthService)
  

  private readonly userPredictionsState = signal<UserPrediction[]>(this.loadPredictions());

  readonly userPredictions = this.userPredictionsState.asReadonly();

  readonly currentUserPrediction = computed(() =>{
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return undefined;
    }
    return this.userPredictionsState().find(
      prediction => prediction.user.id === currentUser.id
    ) ?? null
    }
  );



  private loadPredictions(): UserPrediction[] {
    const savedPredictions = localStorage.getItem(
      this.storageKey
    );

    if (!savedPredictions) {
      return [];
    }

     try {
      return JSON.parse(savedPredictions);
    } catch {
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }

  private savePredictions(predictions: UserPrediction[]): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(predictions)
    );
  }
  getCurrentUserPrediction(): UserPrediction | null {
    const currentUser = this.authService.currentUser();
    if(!currentUser) return null;
    return (
      this.userPredictionsState().find(
        userPrediction => userPrediction.user.id === currentUser.id
      ) ?? null
    );
  }

  saveCurrentPrediction(seasonPrediction: SeasonPrediction): UserPrediction {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      throw new Error('No se puede guardar una predicción sin iniciar sesión');
    }

    const existingPrediction = this.getCurrentUserPrediction();

    const userPrediction: UserPrediction = {
      user: currentUser,
      seasonPrediction,
      createdAt:
        existingPrediction?.createdAt ??
        new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.userPredictionsState.update(predictions => {
      let updatedPredictions: UserPrediction[];

      if (!existingPrediction) {
        updatedPredictions = [
          ...predictions,
          userPrediction
        ];
      } else {
        updatedPredictions = predictions.map(
          prediction =>
            prediction.user.id === currentUser.id
              ? userPrediction
              : prediction
        );
      }

    this.savePredictions(updatedPredictions);

    return updatedPredictions;
  });

  return userPrediction;
  }
}
