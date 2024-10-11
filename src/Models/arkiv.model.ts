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

export interface ArkivMappe {
  $type: string;
  IdReadonly: number;
  NoteTypeKodeIderReadonly: NotetypeStruct;
  Navn: string;
  ParentMappeId: number | null;
  EnhedId: EnhedID;
  Sti: string;
  MaaDerOprettesUnderMapperReadonly: boolean;
  MaaMappenRedigeresReadonly: boolean;
  MaaMappenSlettesReadonly: boolean;
  MaaNoterRedigeresReadonly: boolean;
  MaaNoterSlettesReadonly: boolean;
  MaaNoterSesReadonly: boolean;
  MaaNoterOprettesReadonly: boolean;
  MaaMappenSesReadonly: boolean;
  EnableChangeTrackingAndNotifaction: boolean;
  HenvisningSti?: string;
  DisplayTekst: string;
  id: number;
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
