import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { AuthFacade } from '../../facade/auth.facade';


@Component({
  selector: 'app-header-component',
  imports: [RouterLink, MenubarModule, ButtonModule, TooltipModule ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {

  readonly authFacade = inject(AuthFacade);
  readonly router = inject(Router)
  isAuthenticated = this.authFacade.isAuthenticated;
  isAdmin = computed(()=> this.authFacade.currentUser()?.role === 'ADMIN');
  currentUser = this.authFacade.currentUser;
  menuItems : MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: '/'
    }, 
    {
      label: 'Mis Pronósticos',
      icon: 'pi pi-receipt',
      routerLink: '/myPrediction'
    },
    {
      label:'Tabla de clasificación',
      icon: 'pi pi-table',
      routerLink: '/scores'
    }
  ]

  logOut(){
    this.authFacade.logout();
    this.router.navigate(['/login'])
  }
}
