import { Component } from '@angular/core';
import { SidebarItem } from '../../interfaces/sidebar-item.interface';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  public sidebarItems: SidebarItem[] = [
    {
      label: 'Bancos',
      url: '/banks'
    },
    {
      label: 'Clientes',
      url: '/clients'
    },
    {
      label: 'Monedas',
      url: '/currencies'
    },
    {
      label: 'Tipos de Cambio',
      url: '/exchange-rates'
    },
    {
      label: 'Cuentas Clientes',
      url: '/client-accounts'
    },
    {
      label: 'Provincias',
      url: '/provinces'
    },
    {
      label: 'Cuentas Contables',
      url: '/leager-accounts'
    },
  ]
}
