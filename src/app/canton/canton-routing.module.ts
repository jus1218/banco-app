import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CantonPageComponent } from './pages/canton-page/canton-page.component';

const routes: Routes = [

  {
    path: '',
    children: [
      // { path: 'list', component: ListPageComponent },
      { path: 'register/:codigo', component: CantonPageComponent },
      { path: 'edit/:codigo', component: CantonPageComponent },
      //Debe ir de ultimo sino todas coinciden con el
      { path: ':codigo', component: CantonPageComponent },
      { path: '**', redirectTo: 'register' }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CantonRoutingModule { }
