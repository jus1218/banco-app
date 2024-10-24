import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { PhonePageComponent } from './pages/phone-page/phone-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list/:codigo/:entidad', component: ListPageComponent },
      { path: 'register/:codigoEntidad/:entidad', component: PhonePageComponent },
      { path: 'edit/:codigo/:numero/:codigoEntidad', component: PhonePageComponent },
      //Debe ir de ultimo sino todas coinciden con el
      { path: ':codigo/:numero', component: PhonePageComponent },
      { path: '**', redirectTo: 'list' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhoneRoutingModule { }
