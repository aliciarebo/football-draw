import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../service/auth-service';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-header-component',
  imports: [RouterLink, MenubarModule, ButtonModule, TooltipModule ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {

  readonly authService = inject(AuthService);
  readonly router = inject(Router)
  isAuthenticated = this.authService.isAuthenticated;
  isAdmin = computed(()=> this.authService.currentUser()?.role === 'ADMIN');
  currentUser = this.authService.currentUser;
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
    this.authService.logout();
    this.router.navigate(['/login'])
  }
}
