import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PostazioneDto} from '../../dto/postazione.dto';
import {PostazioneService} from '../../service/postazione.service';
import {Listbox} from 'primeng/listbox';
import {Card} from 'primeng/card';
import {CurrencyPipe} from '@angular/common';
import {PrimeTemplate} from 'primeng/api';
import {AuthService} from '../../../../auth/service/auth.service';
import {GenericDialogComponent} from '../../../../shared/dialog/generic-dialog/generic-dialog.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-postazione',
  templateUrl: './postazione.component.html',
  imports: [
    Listbox,
    Card,
    CurrencyPipe,
    PrimeTemplate
  ],
  styleUrls: ['./postazione.component.scss']
})
export class PostazioneComponent implements OnInit {
  postazioni: PostazioneDto[] = [];
  isLoggedIn = false;
  private ref: DynamicDialogRef | undefined;


  constructor(
    private postazioneService: PostazioneService,
    private router: Router,
    private authService: AuthService,
    private dialogService: DialogService
  ) {
  }

  ngOnInit(): void {
    this.caricaPostazioni();
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  caricaPostazioni(): void {
    this.postazioneService.getPostazioni().subscribe({
      next: (data: PostazioneDto[]) => {
        this.postazioni = data;
      },
      error: (error: any) => {
        console.error('Errore nel caricamento delle postazioni', error);
      }
    });
  }

  selezionaPostazione(postazione: PostazioneDto): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/prenotazione'], {
        state: {id: postazione.id}
      });
    } else {
      this.router.navigate(['/login']);
      this.showSuccessDialog("", "Attenzione", "Non hai effettuato l'accesso", "Per poter prenotare una postazione bisogna accedere al sito. Nel caso non hai un account puoi registrarti gratuitamente");
    }
  }

  showSuccessDialog(type: string, header: string, title: string, message: string) {
    this.ref = this.dialogService.open(GenericDialogComponent, {
      header: header,
      width: '400px',
      data: {
        type: type,
        title: title,
        message: message,
      },
      dismissableMask: true,
    });
  }

}
