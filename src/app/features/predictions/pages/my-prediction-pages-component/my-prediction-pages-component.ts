import { Component, inject, OnInit, signal } from '@angular/core';
import { SeasonPredictionFormComponent } from "../../components/season-prediction-form-component/season-prediction-form-component";
import { SeasonPrediction } from '../../models/season-prediction.model';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { SeasonTicketComponent } from "../../components/season-ticket-component/season-ticket-component";
import { PredictionOptionsFacade } from '../../facade/prediction-options.facade';
import { PredictionFacade } from '../../facade/predictions.facade';
import { ProgressSpinner } from "primeng/progressspinner";

@Component({
  selector: 'app-my-prediction-pages-component',
  imports: [SeasonPredictionFormComponent, ButtonModule, DrawerModule, DividerModule, SeasonTicketComponent, ProgressSpinner],
  templateUrl: './my-prediction-pages-component.html',
  styleUrl: './my-prediction-pages-component.css',
})
export class MyPredictionPagesComponent implements OnInit {
  
  readonly optionsFacade = inject(PredictionOptionsFacade);
  readonly predictionFacade = inject(PredictionFacade);
  
  readonly prediction = this.predictionFacade.userPrediction;

  readonly savingPrediction = this.predictionFacade.savingPrediction;
  readonly loadingUserPrediction = this.predictionFacade.loadingUserPrediction;
  
  drawerVisible = signal<boolean>(false);

  ngOnInit(): void {
    this.optionsFacade.loadOptions();
    this.predictionFacade.obtainUserPrediction();
  }

  openDrawer(){
    this.drawerVisible.set(true);
  }

  closeDrawer(){
    this.drawerVisible.set(false);
  }

  editPrediction(){
    this.openDrawer();
  }

  savePrediction(prediction: SeasonPrediction): void {
  const request$ = this.prediction()
    ? this.predictionFacade.updatePrediction(prediction)
    : this.predictionFacade.createPrediction(prediction);

  request$.subscribe({
    next: () => {
      this.closeDrawer();
    }
  });
}

  
}
