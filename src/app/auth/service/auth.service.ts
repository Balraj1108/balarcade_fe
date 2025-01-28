import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false;

  login() {
    this.isLoggedIn = true; // Simula il login
  }

  logout() {
    this.isLoggedIn = false; // Simula il logout
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
