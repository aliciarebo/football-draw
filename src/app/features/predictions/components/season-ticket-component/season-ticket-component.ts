import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SeasonPrediction } from '../../models/season-prediction.model';
import { ButtonModule } from 'primeng/button';
import { UserPrediction } from '../../../home/models/user-prediction.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-season-ticket-component',
  imports: [ButtonModule, DatePipe],
  templateUrl: './season-ticket-component.html',
  styleUrl: './season-ticket-component.css',
})
export class SeasonTicketComponent {
  @Input() userPrediction: UserPrediction | null = null;
  @Output() editPrediction = new EventEmitter<void>();
  @Input() editable = false;
}
