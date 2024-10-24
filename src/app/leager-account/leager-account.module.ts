import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeagerAccountRoutingModule } from './leager-account-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { LeagerAccoutPageComponent } from './pages/leager-accout-page/leager-accout-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ListPageComponent,
    LeagerAccoutPageComponent
  ],
  imports: [
    CommonModule,
    LeagerAccountRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class LeagerAccountModule { }
