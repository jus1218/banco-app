import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { BankPageComponent } from './pages/bank-page/bank-page.component';
// a-m = snipper

// localhost:4200/banks/
const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'list', component: ListPageComponent },
      { path: 'register' ,component: RegisterPageComponent },
      { path: 'edit/:id', component: RegisterPageComponent },
      {//Debe ir de ultimo sino todas coinciden con el
        path: ':id/:moneda',  component: BankPageComponent
      },
      {
        path:'**',
        redirectTo:'list'
      }
    ]
  }
]



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BanksRoutingModule { }
