import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PrenotazioneInviaDto} from '../dto/prenotazione-invia.dto';
import {environment} from '../../../../environments/environment';
import {PrenotazioneConfermataDto} from '../dto/prenotazione-confermata.dto';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioneService {

  constructor(private http: HttpClient) {
  }

  createPrenotazione(prenotazione: PrenotazioneInviaDto): Observable<any> {
    return this.http.post<any>(environment.baseHost + '/api/prenotazione', prenotazione);
  }

  modificaPrenotazione(prenotazione: PrenotazioneInviaDto): Observable<any> {
    return this.http.put<any>(environment.baseHost + '/api/prenotazione', prenotazione);
  }

  getPostazioniPrenotate(idUtente: number): Observable<PrenotazioneConfermataDto[]> {
    return this.http.get<PrenotazioneConfermataDto[]>(environment.baseHost + '/api/prenotazione?id=' + idUtente);
  }

  getTuttePostazioniPrenotate(): Observable<PrenotazioneConfermataDto[]> {
    return this.http.get<PrenotazioneConfermataDto[]>(environment.baseHost + '/api/prenotazione/tutte');
  }

  eliminaPrenotazione(idPrenotazione: number): Observable<any> {
    return this.http.delete<any>(environment.baseHost + '/api/prenotazione?idPrenotazione=' + idPrenotazione);
  }

}
