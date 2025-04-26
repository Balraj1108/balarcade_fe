import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {PostazioneDto} from '../../../home/dto/postazione.dto';
import {PrenotazioneDto} from '../../dto/prenotazione.dto';
import {PrenotazioneService} from '../../service/prenotazione.service';
import {Card} from 'primeng/card';
import {FormsModule} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {TableModule} from 'primeng/table';
import {ButtonDirective} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {DropdownModule} from 'primeng/dropdown';
import {Select} from 'primeng/select';
import {NgIf} from '@angular/common';
import {PostazioneService} from '../../../home/service/postazione.service';
import {GenericDialogComponent} from '../../../../shared/dialog/generic-dialog/generic-dialog.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-prenotazione',
  templateUrl: './prenotazione.component.html',
  styleUrls: ['./prenotazione.component.scss'],
  providers: [MessageService],
  imports: [
    Card,
    FormsModule,
    InputNumber,
    TableModule,
    ButtonDirective,
    DatePicker,
    DropdownModule,
    Select,
    NgIf
  ],
  standalone: true
})
export class PrenotazioneComponent implements OnInit {
  postazione!: PostazioneDto | null;
  prenotazioniEsistenti: PrenotazioneDto[] = [];
  errorMessage: string | null = null;
  private ref: DynamicDialogRef | undefined;
  nuovaPrenotazione: PrenotazioneDto = {
    dataInizio: new Date(),
    dataFine: new Date(),
    utenteId: 1,
    postazioneId: 0,
    costoTotale: 0
  };

  minDate!: Date;
  maxDate!: Date;
  timeOptions: any[] = [];
  selectedStartHour: number = 9;
  selectedEndHour: number = 10;

  constructor(
    private router: Router,
    private prenotazioneService: PrenotazioneService,
    private postazioneService: PostazioneService,
    private dialogService: DialogService
  ) {
    this.generateTimeOptions();
  }

  ngOnInit(): void {
    const state = history.state as { id: number };
    if (state?.id) {
      this.caricaPostazioneById(state.id);
    } else {
      this.caricaPrimaPostazione();
    }
    this.setDateValidation();
  }

  private caricaPostazioneById(id: number): void {
    this.postazioneService.getPostazioni().subscribe({
      next: (data: PostazioneDto[]) => {
        this.postazione = data.find(p => p.id === id) || null;
      },
      error: (error: any) => {
        console.error('Errore nel caricamento della postazione', error);
      }
    });
  }

  private caricaPrimaPostazione(): void {
    this.postazioneService.getPostazioni().subscribe({
      next: (data: PostazioneDto[]) => {
        this.postazione = data[0] || null;
      },
      error: (error: any) => {
        console.error('Errore nel caricamento delle postazioni', error);
      }
    });
  }

  generateTimeOptions(): void {
    for (let i = 9; i <= 17; i++) {
      this.timeOptions.push({label: `${i}:00`, value: i});
    }
  }


  setDateValidation(): void {
    const oggi = new Date();
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(oggi.getDate() + 7);
  }

  updateDates(): void {
    this.errorMessage = null;
    if (this.selectedStartHour >= this.selectedEndHour) {
      this.errorMessage = "L'ora di inizio deve essere precedente all'ora di fine";
      return;
    }

    const startDate = new Date(this.nuovaPrenotazione.dataInizio);
    startDate.setHours(this.selectedStartHour, 0, 0, 0);
    this.nuovaPrenotazione.dataInizio = startDate;

    const endDate = new Date(this.nuovaPrenotazione.dataInizio);
    endDate.setHours(this.selectedEndHour, 0, 0, 0);
    this.nuovaPrenotazione.dataFine = endDate;

    this.calcolaCostoTotale();
  }

  calcolaCostoTotale(): void {
    const ore = this.selectedEndHour - this.selectedStartHour;

    if (ore > 8) {
      this.errorMessage = 'Non puoi prenotare più di 8 ore consecutive';
      return;
    }

    this.nuovaPrenotazione.costoTotale = ore * this.postazione!.costoOra!;
  }

  isWeekday(date: Date): boolean {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  }

  confermaPrenotazione(): void {
    if (this.selectedStartHour >= this.selectedEndHour) {
      this.errorMessage = 'L\'ora di inizio deve essere precedente all\'ora di fine';
      return;
    }
    if (!this.isWeekday(this.nuovaPrenotazione.dataInizio)) {
      this.errorMessage = 'Puoi prenotare solo dal lunedì al venerdì';
      return;
    }

    if (this.selectedStartHour < 9 || this.selectedEndHour > 17) {
      this.errorMessage = 'Puoi prenotare solo tra le 9:00 e le 17:00';
      return;
    }

    this.nuovaPrenotazione.postazioneId = this.postazione?.id;

    const formattedPrenotazione = {
      ...this.nuovaPrenotazione,
      dataInizio: this.formatLocalDateForAPI(this.nuovaPrenotazione.dataInizio),
      dataFine: this.formatLocalDateForAPI(this.nuovaPrenotazione.dataFine)
    };

    this.prenotazioneService.createPrenotazione(formattedPrenotazione).subscribe(
      {
        next: res => {
          this.showSuccessDialog("success", "Successo", 'Prenotazione confermata', "Basta presentarsi all'orario prenotato, in caso contrario la prenotazione verrà annullata");
          this.router.navigate(['/home']);

        },
        error: (err) => {
          this.showSuccessDialog("error", "Errore", "", err.error?.error);
          console.log(err.error);
        }
      }
    )
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

  private formatLocalDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

}
