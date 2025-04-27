import {Component, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {PrenotazioneConfermataDto} from '../../../prenotazione/dto/prenotazione-confermata.dto';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {PrenotazioneService} from '../../../prenotazione/service/prenotazione.service';
import {ConfirmationDialogComponent} from '../../../../shared/dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-prenotazioni',
  imports: [
    DatePipe,
    PrimeTemplate,
    TableModule
  ],
  templateUrl: './prenotazioni.component.html',
  styleUrl: './prenotazioni.component.css',
  standalone: true
})
export class PrenotazioniComponent implements OnInit {
  prenotazioni: PrenotazioneConfermataDto[] = [];
  loading: boolean = true;
  private ref: DynamicDialogRef | undefined;


  constructor(
    private prenotazioneService: PrenotazioneService,
    private dialogService: DialogService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.loadPrenotazioni();
  }


  loadPrenotazioni(): void {
    this.loading = true;
    this.prenotazioneService.getTuttePostazioniPrenotate().subscribe({
      next: (prenotazioni) => {
        this.prenotazioni = prenotazioni;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento prenotazioni:', err);
        this.loading = false;
      }
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
}
