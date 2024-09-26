import { Component, Input } from '@angular/core';
import { Bank } from '../../interfaces/bank.interface';

@Component({
  selector: 'bank-table-banks',
  templateUrl: './table-banks.component.html',
  styleUrl: './table-banks.component.css'
})
export class TableBanksComponent {
  @Input()
  public banks!:Bank[];



}
