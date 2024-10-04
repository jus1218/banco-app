import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BanksRoutingModule } from './banks-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { SharedModule } from '../shared/shared.module';
import { TableBanksComponent } from './components/table-banks/table-banks.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BankPageComponent } from './pages/bank-page/bank-page.component';



@NgModule({
  declarations: [
    ListPageComponent, LayoutPageComponent, RegisterPageComponent, BankPageComponent, TableBanksComponent
  ],
  imports: [
    CommonModule,
    BanksRoutingModule,
    SharedModule,
    ReactiveFormsModule

  ]
})
export class BanksModule { }
