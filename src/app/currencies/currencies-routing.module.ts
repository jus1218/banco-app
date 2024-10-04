import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { CurrencyPageComponent } from './pages/currency-page/currency-page/currency-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ListPageComponent

      },
      {
        path:'register',
        component:CurrencyPageComponent
      },
      {
        path:'edit/:id',
        component:CurrencyPageComponent
      },
      {//Debe ir de ultimo sino todas coinciden con el
        path: ':id', component: CurrencyPageComponent
      },
      {
        path: '**',
        redirectTo: 'list'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRateRoutingModule { }
