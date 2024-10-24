export interface NoterStruct {
  $type: string;
  $values: Note[];
}

export interface Note {
  $type: string;
  Gruppe: number;
  Id: number;
  Tekst: string;
  Orden: number | null;
  TagNummer: number | null;
  TagTekst: null | string;
  ErLaast: boolean;
  ErStandard: boolean;
  ErSynlig: boolean;
  Tekst2: null;
  EnableChangeTrackingAndNotifaction: boolean;
  DisplayTekst: string;
  unikId: number;
}
