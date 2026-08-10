import { Component, Input, Signal } from '@angular/core';
import { UserScore } from '../../models/season-result.model';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-scores-table-component',
  imports: [TableModule, TagModule, ButtonModule],
  templateUrl: './scores-table-component.html',
  styleUrl: './scores-table-component.css',
})
export class ScoresTableComponent {
 @Input() scores : UserScore[] = []
}

