import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneRoutingModule } from './phone-routing.module';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { PhonePageComponent } from './pages/phone-page/phone-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ListPageComponent,
    PhonePageComponent
  ],
  imports: [
    CommonModule,
    PhoneRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PhoneModule { }
