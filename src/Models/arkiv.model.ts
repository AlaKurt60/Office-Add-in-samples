export interface ArkivMappeRoot {
  MapperReadonly: ArkivMappeStruct;
  MaaDerOprettesUnderMapperReadonly: boolean;
  MaaNoterRedigeresReadonly: boolean;
  MaaNoterSlettesReadonly: boolean;
  MaaNoterVisesReadonly: boolean;
  MaaNoterOprettesReadonly: boolean;
  MaaMapperSesReadonly: boolean;
  EnableChangeTrackingAndNotifaction: boolean;
}

export class ArkivMappe {
  IdReadonly?: number;
  NoteTypeKodeIderReadonly?: NotetypeStruct;
  Navn!: string;
  ParentMappeId?: number;
  EnhedId?: EnhedID;
  Sti?: string;
  HenvisningSti?: string;
  DisplayTekst!: string;
  unikId: number;

  constructor(navn: string) {
    this.Navn = navn;
    this.DisplayTekst = navn;
    this.unikId = 0;
  }
}

export interface ArkivMappeStruct {
  $type: string;
  $values: Array<ArkivMappe>;
}

export interface NotetypeStruct {
  $type: string;
  $values: Array<number>;
}

export interface EnhedID {
  $type: string;
  Id: number;
  Kartotek: Kartotek;
}

export interface Kartotek {
  $type: string;
  Tabelnavn: Tabelnavn;
}

export enum Tabelnavn {
  Lejer = 'LEJER',
}
