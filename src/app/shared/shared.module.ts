import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { BanksRoutingModule } from '../banks/banks-routing.module';
import { TableComponent } from './components/table/table.component';
import { InputComponent } from './components/input/input/input.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { CurrencyFormatPipe } from './pipe/currency-format.pipe';
import { DateFormartPipe } from './pipe/date-formart.pipe';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { FormsModule } from '@angular/forms';
import { FormComponent } from '../client-account/components/form/form.component';



@NgModule({
  declarations: [
    NotFoundPageComponent,
    SideMenuComponent,
    TableComponent,
    InputComponent,
    PaginationComponent,
    LoadingSpinnerComponent,
    CurrencyFormatPipe,
    DateFormartPipe,
    AlertDialogComponent

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
    PaginationComponent,
    LoadingSpinnerComponent,
    CurrencyFormatPipe,
    DateFormartPipe,
    AlertDialogComponent

  ]
})
export class SharedModule { }
