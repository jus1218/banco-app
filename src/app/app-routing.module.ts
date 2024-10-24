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
    path: 'client-accounts',
    loadChildren: () => import('./client-account/client-account.module').then(m => m.ClientAccountModule)
  },
  {
    path: 'provinces',
    loadChildren: () => import('./province/province.module').then(m => m.ProvinceModule)
  },
  {
    path: 'districts',
    loadChildren: () => import('./district/district.module').then(m => m.DistrictModule)
  },
  {
    path: 'cantons',
    loadChildren: () => import('./canton/canton.module').then(m => m.CantonModule)
  },
  {
    path: 'phones',
    loadChildren: () => import('./phone/phone.module').then(m => m.PhoneModule)
  }
  ,
  {
    path: 'leager-accounts',
    loadChildren: () => import('./leager-account/leager-account.module').then(m => m.LeagerAccountModule)
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
