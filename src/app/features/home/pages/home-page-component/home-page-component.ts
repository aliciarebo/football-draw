import { Component, inject, Signal, signal } from '@angular/core';
import { SeasonPrediction } from '../../../predictions/models/season-prediction.model';
import { UserPrediction } from '../../models/user-prediction.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { SeasonTicketComponent } from '../../../predictions/components/season-ticket-component/season-ticket-component';
import { UserPredictionCardComponent } from "../../components/user-prediction-card-component/user-prediction-card-component";
import { PredictionService } from '../../../predictions/service/prediction.service';

@Component({
  selector: 'app-home-page-component',
  imports: [ButtonModule,
    CardModule,
    DialogModule,
    TagModule,
    SeasonTicketComponent, UserPredictionCardComponent],
  providers: [],
  templateUrl: './home-page-component.html',
  styleUrl: './home-page-component.css',
})
export class HomePageComponent {

  detailVisible = false;
  selectedUserPrediction: UserPrediction | null = null;
  predictionService = inject(PredictionService)

  readonly predictions = this.predictionService.userPredictions;

  openPrediction(user: UserPrediction): void {
    this.selectedUserPrediction = user;
    this.detailVisible = true;
  }

  closePrediction(): void {
    this.detailVisible = false;
    this.selectedUserPrediction = null;
  }


}
