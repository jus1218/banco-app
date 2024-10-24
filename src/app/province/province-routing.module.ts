import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ProvincePageComponent } from './pages/province-page/province-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: ListPageComponent },
      { path: 'register', component: ProvincePageComponent },
      { path: 'edit/:codigo', component: ProvincePageComponent },
      //Debe ir de ultimo sino todas coinciden con el
      { path: ':codigo', component: ProvincePageComponent },
      { path: '**', redirectTo: 'list' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvinceRoutingModule { }
