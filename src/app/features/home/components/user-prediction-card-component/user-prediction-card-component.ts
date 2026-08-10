import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from "primeng/card";
import { Tag } from "primeng/tag";
import { Button } from "primeng/button";
import { UserPrediction } from '../../models/user-prediction.model';

@Component({
  selector: 'app-user-prediction-card-component',
  imports: [Card, Tag, Button],
  templateUrl: './user-prediction-card-component.html',
  styleUrl: './user-prediction-card-component.css',
})
export class UserPredictionCardComponent {
  @Input() userPrediction: UserPrediction |null = null
  @Output() openPrediction = new EventEmitter<void>();


}
