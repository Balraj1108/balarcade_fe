import {Injectable} from '@angular/core';
import {LoginDto} from '../dto/login.dto';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {
  }

  loginService(loginDto: LoginDto): Observable<any> {
    const url = environment.baseHost + environment.loginPath;
    return this.http.post(url, loginDto).pipe(
      tap(accessToken => {
        {
          this.localSaveSession(accessToken);
          this.loggedIn.next(true);
        }
      })
    );
  }

  localSaveSession(token: any): void {
    localStorage.setItem('accessToken', token['jwt-token']);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!(token && this.isTokenValid(token));
  }

  private isTokenValid(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    return expiry > Date.now();
  }
}
