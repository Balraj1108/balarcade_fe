import {Routes} from '@angular/router';
import {LoginPageComponent} from './shared/components/login-page/login-page.component';

export const routes: Routes = [
  {path: 'login', component: LoginPageComponent, pathMatch: 'full'},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.routs'),
  },
  //nel caso in cui voglio fare lazy loading di un solo componente
  // {
  //   path: 'login',
  //   loadComponent: () => import('./shared/components/login-page/login-page.component').then((com) => com.LoginPageComponent),
  // },
  {path: '**', redirectTo: 'login'},
];
