import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'banks',
    pathMatch: 'full'
  },
  {
    path: 'banks',
    loadChildren: () => import('./banks/banks.module').then((m) => m.BanksModule)
  },
  {
    path: 'clients',
    loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule)
  },
  {
    path: 'currencies',
    loadChildren: () => import('./currencies/currencies.module').then(m => m.currenciesModule)
  },
  {
    path: 'exchange-rates',
    loadChildren: () => import('./exchange-rate/exchange-rate.module').then(m => m.ExchangeRateModule)
  },
  {
    path: '404',
    component: NotFoundPageComponent
  },
  {
    path: '**',
    redirectTo: '404'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
