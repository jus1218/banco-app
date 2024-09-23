import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { BanksRoutingModule } from '../banks/banks-routing.module';
import { TableComponent } from './components/table/table.component';



@NgModule({
  declarations: [
    NotFoundPageComponent,
    SideMenuComponent,
    TableComponent
  ],
  imports: [
    CommonModule,BanksRoutingModule
  ],
  exports: [NotFoundPageComponent, SideMenuComponent,TableComponent]
})
export class SharedModule { }
