import { Component, Input, OnInit } from '@angular/core';
import { BanksService } from '../../services/banks.service';
import { Bank } from '../../interfaces/bank.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styles: ``
})
export class ListPageComponent implements OnInit {


  public banks: Bank[] = [];
  constructor(private banksService: BanksService) { }
  ngOnInit(): void {
    this.banksService.getBancos().subscribe(banks => this.banks = banks);
  }

}
