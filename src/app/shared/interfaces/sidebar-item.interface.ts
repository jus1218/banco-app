import { UrlTree } from "@angular/router";

export interface SidebarItem {
  label : String;
  url : string | any[] | UrlTree | null | undefined
}
