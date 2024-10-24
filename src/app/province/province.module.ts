import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvinceRoutingModule } from './province-routing.module';
import { ProvincePageComponent } from './pages/province-page/province-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TableProvinciesComponent } from './components/table-provincies/table-provincies.component';
import { ProvinceManagerComponent } from './components/province-manager/province-manager.component';


@NgModule({
  declarations: [
    ProvincePageComponent,
    ListPageComponent,
    TableProvinciesComponent,
    ProvinceManagerComponent
  ],
  imports: [
    CommonModule,
    ProvinceRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ProvinceModule { }
