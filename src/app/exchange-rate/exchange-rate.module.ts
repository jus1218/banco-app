import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeRateRoutingModule } from './exchange-rate-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ExchangeRatePageComponent } from './pages/exchange-rate-page/exchange-rate-page.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListPageComponent,
    ExchangeRatePageComponent
  ],
  imports: [
    CommonModule,
    ExchangeRateRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ExchangeRateModule { }
