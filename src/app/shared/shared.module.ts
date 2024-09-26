import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { BanksRoutingModule } from '../banks/banks-routing.module';
import { TableComponent } from './components/table/table.component';
import { InputComponent } from './components/input/input/input.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    NotFoundPageComponent,
    SideMenuComponent,
    TableComponent,
    InputComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    BanksRoutingModule,
    HttpClientModule
  ],
  exports: [
    NotFoundPageComponent,
    SideMenuComponent,
    TableComponent,
    InputComponent,
    PaginationComponent]
})
export class SharedModule { }
