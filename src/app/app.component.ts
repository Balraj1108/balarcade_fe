import {Component} from '@angular/core';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [Button],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  openAlert() {
    window.alert("Bella")
  }

}
