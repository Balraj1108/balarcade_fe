import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PostazioneDto} from '../../dto/postazione.dto';
import {PostazioneService} from '../../service/postazione.service';
import {Listbox} from 'primeng/listbox';
import {ProgressBar} from 'primeng/progressbar';
import {Card} from 'primeng/card';
import {CurrencyPipe, NgIf} from '@angular/common';
import {PrimeTemplate} from 'primeng/api';

@Component({
  selector: 'app-postazione',
  templateUrl: './postazione.component.html',
  imports: [
    Listbox,
    ProgressBar,
    Card,
    CurrencyPipe,
    PrimeTemplate,
    NgIf
  ],
  styleUrls: ['./postazione.component.scss']
})
export class PostazioneComponent implements OnInit {
  postazioni: PostazioneDto[] = [];
  loading: boolean = true;

  constructor(
    private postazioneService: PostazioneService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.caricaPostazioni();
  }

  caricaPostazioni(): void {
    this.loading = true;
    this.postazioneService.getPostazioni().subscribe({
      next: (data: PostazioneDto[]) => {
        this.postazioni = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Errore nel caricamento delle postazioni', error);
        this.loading = false;
      }
    });
  }

  selezionaPostazione(postazione: PostazioneDto): void {
    console.log(postazione);
    this.router.navigate(['/prenotazione', postazione.id]);
  }
}
