import { Component } from '@angular/core';
import { SidebarItem } from '../../../shared/interfaces/sidebar-item.interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: `h1{ margin-bottom:1rem; position:sticky }`
})
export class LayoutPageComponent {
  public TitlePage : String = 'Bancos';

  public sidebarItems: SidebarItem[] = [
    {
      label: 'Bancos',
      url:'/banks'
    },
    {
      label: 'Clientes',
      url:'/clients'
    },
    {
      label: 'Tipo Cambio',
      url:'/exchange-rate'
    },
  ]

}
