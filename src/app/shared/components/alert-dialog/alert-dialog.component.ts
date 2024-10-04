import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.css'
})
export class AlertDialogComponent {
  @Input()
  public title!: string;
  @Input()
  public action: 'DELETE' | 'CREATE' | '' = '';


  @Input()
  public description!: String;

}
