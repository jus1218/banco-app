import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ExchangeRatePageComponent } from './pages/exchange-rate-page/exchange-rate-page.component';

const routes: Routes = [

  {
    path: '',
    children: [
      {
        path: 'list',
        component: ListPageComponent

      },
      {
        path: 'register',
        component: ExchangeRatePageComponent
      },
      {
        path: 'edit/:codigoMoneda/:fecha/:codigoBanco',
        component: ExchangeRatePageComponent
      },
      {//Debe ir de ultimo sino todas coinciden con el
        path: ':codigoMoneda/:fecha/:codigoBanco', component: ExchangeRatePageComponent
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
