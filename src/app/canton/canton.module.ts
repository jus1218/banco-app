import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CantonRoutingModule } from './canton-routing.module';
import { CantonPageComponent } from './pages/canton-page/canton-page.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CantonPageComponent
  ],
  imports: [
    CommonModule,
    CantonRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class CantonModule { }
