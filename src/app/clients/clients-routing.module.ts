import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ClientPageComponent } from './pages/client-page/client-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: ListPageComponent },
      { path: 'register', component: ClientPageComponent },
      { path: 'edit/:id', component: ClientPageComponent },
      {//Debe ir de ultimo sino todas coinciden con el
        path: ':id', component: ClientPageComponent
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
export class ClientsRoutingModule { }
