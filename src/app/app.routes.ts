import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout-component/layout-component';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'myPrediction',
        canActivate: [authGuard],
        loadComponent: () =>
          import(
            './features/predictions/pages/my-prediction-pages-component/my-prediction-pages-component'
          ).then(m => m.MyPredictionPagesComponent)
      },
      {
        path: 'login',
        loadComponent: () =>
          import(
            './features/login/pages/login-pages-component/login-pages-component'
          ).then(m => m.LoginPagesComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import(
            './features/home/pages/home-page-component/home-page-component'
          ).then(m => m.HomePageComponent)
      },
      {
        path: 'scores',
        loadComponent: ()=> import('./features/scores/pages/scores-page-component/scores-page-component').then(m => m.ScoresPageComponent)
      },
      {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import('./features/scores/pages/results-admin-page-component/results-admin-page-component').then(m => m.ResultsAdminPageComponent)
      }
    ]
  }
];