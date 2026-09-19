import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { UserScore } from '../../models/season-result.model';

@Component({
  selector: 'app-scores-table-component',
  imports: [TableModule, TagModule, ButtonModule],
  templateUrl: './scores-table-component.html',
  styleUrl: './scores-table-component.css',
})
export class ScoresTableComponent {
  @Input() scores: UserScore[] = [];
}
