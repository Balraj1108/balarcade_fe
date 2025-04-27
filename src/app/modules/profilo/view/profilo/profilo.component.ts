import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {CommonModule, DatePipe} from '@angular/common';
import {PrenotazioneService} from '../../../prenotazione/service/prenotazione.service';
import {UtenteDto} from '../../../../auth/dto/utente.dto';
import {PrenotazioneConfermataDto} from '../../../prenotazione/dto/prenotazione-confermata.dto';
import {TableModule} from 'primeng/table';
import {ConfirmationDialogComponent} from '../../../../shared/dialog/confirmation-dialog/confirmation-dialog.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-profilo',
  imports: [CommonModule, TableModule],
  templateUrl: './profilo.component.html',
  styleUrl: './profilo.component.css',
  standalone: true
})
export class ProfiloComponent implements OnInit {
  userInfo: UtenteDto | undefined;
  prenotazioni: PrenotazioneConfermataDto[] = [];
  loading: boolean = true;
  private ref: DynamicDialogRef | undefined;


  constructor(
    private prenotazioneService: PrenotazioneService,
    private router: Router,
    private messageService: MessageService,
    private dialogService: DialogService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadPrenotazioni();
  }

  loadUserInfo(): void {
    const user = localStorage.getItem('utente');
    console.log()
    if (user) {
      this.userInfo = JSON.parse(user);
    }
  }

  loadPrenotazioni(): void {
    this.loading = true;
    this.prenotazioneService.getPostazioniPrenotate(this.userInfo?.id!).subscribe({
      next: (prenotazioni) => {
        this.prenotazioni = prenotazioni;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento prenotazioni:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Errore',
          detail: 'Impossibile caricare le prenotazioni'
        });
      }
    });
  }

  modificaPrenotazione(prenotazione: PrenotazioneConfermataDto): void {
    this.router.navigate(['/prenotazione'], {
      state: {prenotazioneDaModificare: prenotazione}
    });
  }

  cancellaPrenotazione(prenotazione: PrenotazioneConfermataDto): void {
    const formattedDateTime = this.datePipe.transform(prenotazione.dataInizio, 'dd/MM/yyyy \'alle\' HH:mm');
    this.ref = this.dialogService.open(ConfirmationDialogComponent, {
      header: 'Conferma eliminazione',
      width: '400px',
      data: {
        type: "confirm",
        message: "Sei sicuro di voler eliminare la prenotazione del " + formattedDateTime,
        buttonLabel: 'Conferma',
        showCancel: true,
      },
      dismissableMask: true,
    });

    this.ref.onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.prenotazioneService.eliminaPrenotazione(prenotazione.id!).subscribe({
          next: () => {
            this.loadPrenotazioni();
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
  }

  checkDataInizio(prenotazione: PrenotazioneConfermataDto): boolean {
    const now = new Date();
    const dataInizio = new Date(prenotazione.dataInizio);
    return dataInizio > now;
  }
}
