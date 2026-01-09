// src/types.ts

export interface TibbiBirim {
  birimID: number;
  birimAdi: string;
}

export interface Doktor {
  doktorID: number;
  adSoyad: string;
  uzmanlik: string;
  tibbiBirim: TibbiBirim;
}

export interface Hasta {
  hastaID: number;
  adSoyad: string;
  yas: number;
  hastalik: string;
}

export interface HastaKayit {
  kayitID: number;
  hasta: Hasta;
  tibbiBirim: TibbiBirim;
  doktor: Doktor;
  tarih: string;
  durum: string;
}