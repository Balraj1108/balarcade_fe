import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {RegistrazioneDto} from '../dto/registrazione.dto';

@Injectable({
  providedIn: 'root'
})
export class RegistrazioneService {

  constructor(private http: HttpClient) { }

  registraUtente(registrazioneDto: RegistrazioneDto): Observable<any> {
    return this.http.post<any>(environment.baseHost + '/api/utente/registrazione', registrazioneDto);
  }

}
