import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PrenotazioneInviaDto} from '../dto/prenotazione-invia.dto';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioneService {

  constructor(private http: HttpClient) {
  }

  createPrenotazione(prenotazione: PrenotazioneInviaDto): Observable<any> {
    return this.http.post<any>(environment.baseHost + '/api/prenotazione', prenotazione);
  }

}
