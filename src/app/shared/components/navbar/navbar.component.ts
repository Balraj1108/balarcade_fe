import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../auth/service/auth.service';
import { RouterModule } from '@angular/router';
import {Menubar} from 'primeng/menubar';
import {PrimeTemplate} from 'primeng/api';
import {ButtonDirective} from 'primeng/button';
import {UtenteDto} from '../../../auth/dto/utente.dto';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, Menubar, PrimeTemplate, ButtonDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true
})
export class NavbarComponent implements OnInit {

  isLoggedIn = false;
  userInfo: UtenteDto | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.loadUserInfo();
    });
  }

  loadUserInfo(): void {
    const user = localStorage.getItem('utente');
    console.log()
    if (user) {
      this.userInfo = JSON.parse(user);
    }
  }

  onLogout() {
    this.authService.logout();
  }


  checkAdmin() {
    return this.isLoggedIn && this.userInfo?.ruolo == "ADMIN"
  }
}
