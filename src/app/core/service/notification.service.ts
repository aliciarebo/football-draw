import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class Notification {
  private readonly messageService = inject(MessageService);

  sucessMessage(summary: string, detail: string): void {
    this.messageService.add({
      severity: 'sucess',
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
