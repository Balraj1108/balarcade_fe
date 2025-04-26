import {Routes} from '@angular/router';
import {LoginPageComponent} from './shared/components/login-page/login-page.component';
import {ProfiloComponent} from './modules/profilo/view/profilo/profilo.component';
import {AuthGuard} from './auth/guard/auth.guard';
import {RegistrazioneComponent} from './modules/registrazione/view/registrazione/registrazione.component';
import {NoAuthGuard} from './auth/guard/no-auth.guard';
import {PrenotazioneComponent} from './modules/prenotazione/view/prenotazione/prenotazione.component';

export const routes: Routes = [
  {path: 'login', component: LoginPageComponent, pathMatch: 'full', canActivate: [NoAuthGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.routs'),
  },
  { path: 'profilo', component: ProfiloComponent, canActivate: [AuthGuard] },
  { path: 'prenotazione', component: PrenotazioneComponent, canActivate: [AuthGuard] },
  { path: 'registrazione', component: RegistrazioneComponent, canActivate: [NoAuthGuard]},
  {path: '**', redirectTo: 'login'},
];
