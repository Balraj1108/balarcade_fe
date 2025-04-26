export interface PrenotazioneDto {
  prenotazioneId?: number;
  dataInizio: Date;
  dataFine: Date;
  utenteId?: number;
  postazioneId?: number;
  costoTotale?: number;
}
