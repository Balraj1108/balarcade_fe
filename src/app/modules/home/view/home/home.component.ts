import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {PostazioneComponent} from '../../components/postazione/postazione.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, PostazioneComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {

}
