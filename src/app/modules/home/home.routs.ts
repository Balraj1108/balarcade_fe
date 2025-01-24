import {HomeComponent} from './view/home/home.component';
import {Route} from '@angular/router';
import {PostazioneComponent} from './components/postazione/postazione.component';


export default [
  {path: '', component: HomeComponent},
  {path: 'postazione', component: PostazioneComponent},
] as Route[];
