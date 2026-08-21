import { Component, inject, OnInit} from '@angular/core';
import { UserPrediction } from '../../models/user-prediction.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { SeasonTicketComponent } from '../../../predictions/components/season-ticket-component/season-ticket-component';
import { UserPredictionCardComponent } from "../../components/user-prediction-card-component/user-prediction-card-component";
import { PredictionFacade } from '../../../predictions/facade/predictions.facade';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-home-page-component',
  imports: [ButtonModule,
    CardModule,
    DialogModule,
    TagModule,
    SeasonTicketComponent, UserPredictionCardComponent, ProgressSpinnerModule],
  providers: [],
  templateUrl: './home-page-component.html',
  styleUrl: './home-page-component.css',
})
export class HomePageComponent implements OnInit{
  detailVisible = false;
  selectedUserPrediction: UserPrediction | null = null;
  predictionFacade = inject(PredictionFacade);

  readonly predictions = this.predictionFacade.usersPredictions;

  ngOnInit(): void {
    this.predictionFacade.obtainPredictions();
  }

  openPrediction(user: UserPrediction): void {
    this.selectedUserPrediction = user;
    this.detailVisible = true;
  }

  closePrediction(): void {
    this.detailVisible = false;
    this.selectedUserPrediction = null;
  }


}
