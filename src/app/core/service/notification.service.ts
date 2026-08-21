import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class Notification {
  private readonly messageService = inject(MessageService);

  successMessage(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail
    });
  }

  errorMessage(summary: string, detail: string): void{
    this.messageService.add({
      severity: 'error',
      summary,
      detail
    });
  }
}
