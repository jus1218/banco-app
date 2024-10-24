import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ClientAccountPageComponent } from './pages/client-account-page/client-account-page.component';

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
        component: ClientAccountPageComponent
      },
      {
        path: 'edit/:codigoCuentaCliente',
        component: ClientAccountPageComponent
      },
       {//Debe ir de ultimo sino todas coinciden con el
        path: ':codigoCuentaCliente', component: ClientAccountPageComponent
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
export class ClientAccountRoutingModule { }
