import { Component, Input } from '@angular/core';
import { Message } from '../../interfaces/message.interface';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.css'
})
export class AlertDialogComponent {
  @Input()
  public message: Message | null = null;





}
