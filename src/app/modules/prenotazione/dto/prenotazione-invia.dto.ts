export interface PrenotazioneInviaDto {
  prenotazioneId?: number;
  dataInizio: string;
  dataFine: string;
  utenteId?: number;
  postazioneId?: number;
  costoTotale?: number;
}
