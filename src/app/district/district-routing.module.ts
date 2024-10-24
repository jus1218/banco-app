import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DistrictPageComponent } from './pages/district-page/district-page.component';

const routes: Routes = [

  {
    path: '',
    children: [
      // { path: 'list', component: ListPageComponent },
      { path: 'register/:codigo', component: DistrictPageComponent },
      { path: 'edit/:codigo', component: DistrictPageComponent },
      //Debe ir de ultimo sino todas coinciden con el
      { path: ':codigo', component: DistrictPageComponent },
      { path: '**', redirectTo: 'register' }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistrictRoutingModule { }
