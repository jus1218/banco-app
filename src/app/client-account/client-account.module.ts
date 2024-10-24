import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientAccountRoutingModule } from './client-account-routing.module';
import { ClientAccountPageComponent } from './pages/client-account-page/client-account-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ClientAccountPageComponent,
    ListPageComponent
  ],
  imports: [
    CommonModule,
    ClientAccountRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class ClientAccountModule { }
