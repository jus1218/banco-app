import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeRateRoutingModule } from './currencies-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPageComponent } from './pages/currency-page/currency-page/currency-page.component';


@NgModule({
  declarations: [
    ListPageComponent,
    CurrencyPageComponent
  ],
  imports: [
    CommonModule,
    ExchangeRateRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class currenciesModule { }
