import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {PostazioneDto} from '../dto/postazione.dto';

@Injectable({
  providedIn: 'root'
})
export class PostazioneService {

  constructor(private http: HttpClient) { }

  getPostazioni(): Observable<PostazioneDto[]> {
    return this.http.get<any>(environment.baseHost + '/api/postazione');
  }

}
