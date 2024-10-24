import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistrictRoutingModule } from './district-routing.module';
import { DistrictPageComponent } from './pages/district-page/district-page.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DistrictPageComponent
  ],
  imports: [
    CommonModule,
    DistrictRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class DistrictModule { }
