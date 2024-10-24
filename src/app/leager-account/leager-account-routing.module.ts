import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { LeagerAccoutPageComponent } from './pages/leager-accout-page/leager-accout-page.component';

const routes: Routes = [


  {
    path: '',
    children: [
      { path: 'list', component: ListPageComponent },
      { path: 'register', component: LeagerAccoutPageComponent },
      { path: 'edit/:codigo', component: LeagerAccoutPageComponent },
      {//Debe ir de ultimo sino todas coinciden con el
        path: ':codigo', component: LeagerAccoutPageComponent
      },

      { path: '**', redirectTo: 'list' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeagerAccountRoutingModule { }
