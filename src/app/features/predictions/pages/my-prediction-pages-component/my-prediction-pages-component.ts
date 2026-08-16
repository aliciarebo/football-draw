import { Component, inject, OnInit, signal } from '@angular/core';
import { SeasonPredictionFormComponent } from "../../components/season-prediction-form-component/season-prediction-form-component";
import { SeasonPrediction } from '../../models/season-prediction.model';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { DividerModule } from 'primeng/divider';
import { SeasonTicketComponent } from "../../components/season-ticket-component/season-ticket-component";
import { PredictionService } from '../../service/prediction.service';
import { PredictionOptionsFacade } from '../../facade/prediction-options.facade';
import { PredictionFacade } from '../../facade/predictions.facade';

@Component({
  selector: 'app-my-prediction-pages-component',
  imports: [SeasonPredictionFormComponent, ButtonModule, DrawerModule, DividerModule, SeasonTicketComponent],
  templateUrl: './my-prediction-pages-component.html',
  styleUrl: './my-prediction-pages-component.css',
})
export class MyPredictionPagesComponent implements OnInit {
  
  readonly optionsFacade = inject(PredictionOptionsFacade);
  readonly predictionFacade = inject(PredictionFacade);
  
  readonly prediction = this.predictionFacade.userPrediction;
  
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

  savePrediction(prediction: SeasonPrediction){
    if (this.prediction()) {
      this.predictionFacade.updatePrediction(prediction);
    } else {
      this.predictionFacade.createPrediction(prediction);
    }

    this.closeDrawer();
  }

  
}
