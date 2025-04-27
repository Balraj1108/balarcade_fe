export interface PrenotazioneConfermataDto {
  id?: number;
  dataInizio: string;
  dataFine: string;
  idPostazione?: number;
  tipoPostazione?: string;
  nomePostazione?: string;
  costoTotale?: number;
}
